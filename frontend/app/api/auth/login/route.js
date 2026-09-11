import { NextResponse } from 'next/server';
import { query } from '@/app/lib/db';
import { verifyPassword, generateToken } from '@/app/lib/auth';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validation
    if (!email || !email.trim()) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    if (!password) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Query user by email from PostgreSQL
    const userRes = await query(
      `SELECT id, name, email, password_hash, persona, created_at 
       FROM users 
       WHERE LOWER(email) = LOWER($1)`,
      [normalizedEmail]
    );

    if (userRes.rows.length === 0) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const user = userRes.rows[0];

    // Verify password hash
    const isPasswordValid = await verifyPassword(password, user.password_hash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate JWT Token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      persona: user.persona,
    });

    // Create response with httpOnly cookie
    const response = NextResponse.json(
      {
        success: true,
        message: 'Logged in successfully',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          persona: user.persona,
          createdAt: user.created_at,
        },
        token,
      },
      { status: 200 }
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
    console.error('Login API Error:', error);
    const errorMessage = error?.code === '28P01' || error?.code === 'ECONNREFUSED'
      ? error.message
      : (error?.message || 'Internal server error during login');
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
