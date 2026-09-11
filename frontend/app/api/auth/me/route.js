import { NextResponse } from 'next/server';
import { query } from '@/app/lib/db';
import { getAuthUser } from '@/app/lib/auth';

export async function GET(request) {
  try {
    const authPayload = getAuthUser(request);

    if (!authPayload || !authPayload.userId) {
      return NextResponse.json(
        { user: null },
        { status: 200 }
      );
    }

    // Fetch latest user details from database
    const userRes = await query(
      `SELECT id, name, email, persona, created_at, updated_at 
       FROM users 
       WHERE id = $1`,
      [authPayload.userId]
    );

    if (userRes.rows.length === 0) {
      return NextResponse.json(
        { error: 'User no longer exists' },
        { status: 404 }
      );
    }

    const user = userRes.rows[0];

    return NextResponse.json(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          persona: user.persona,
          createdAt: user.created_at,
          updatedAt: user.updated_at,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Auth Me API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error while retrieving session' },
      { status: 500 }
    );
  }
}
