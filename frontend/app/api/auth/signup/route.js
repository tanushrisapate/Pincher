import { NextResponse } from 'next/server';
import { query } from '@/app/lib/db';
import { hashPassword, generateToken } from '@/app/lib/auth';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password, persona } = body;

    // Validation
    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    if (!email || !email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'A valid email is required' }, { status: 400 });
    }

    if (!password || password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if user already exists
    const existingUserRes = await query(
      'SELECT id FROM users WHERE LOWER(email) = LOWER($1)',
      [normalizedEmail]
    );

    if (existingUserRes.rows.length > 0) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(password);
    const userPersona = persona || 'classic';

    // Insert user into PostgreSQL
    const insertRes = await query(
      `INSERT INTO users (name, email, password_hash, persona)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, persona, created_at`,
      [name.trim(), normalizedEmail, passwordHash, userPersona]
    );

    const newUser = insertRes.rows[0];

    // Generate JWT Token
    const token = generateToken({
      userId: newUser.id,
      email: newUser.email,
      name: newUser.name,
      persona: newUser.persona,
    });

    // Create Response with httpOnly cookie
    const response = NextResponse.json(
      {
        success: true,
        message: 'Account created successfully',
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          persona: newUser.persona,
          createdAt: newUser.created_at,
        },
        token,
      },
      { status: 201 }
    );

    response.cookies.set({
      name: 'pincher_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Signup API Error:', error);
    const errorMessage = error?.code === '28P01' || error?.code === 'ECONNREFUSED'
      ? error.message
      : (error?.message || 'Internal server error during registration');
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
