import { NextResponse } from 'next/server';
import { query } from '@/app/lib/db';
import { getAuthUser } from '@/app/lib/auth';

const DEFAULT_PREFERENCES = {
  selectedStyles: ["Minimal", "Casual"],
  favoriteColors: [
    "#111111",
    "#FFFFFF",
    "#1E3A8A",
    "#D4C3A3",
    "#6B7280",
    "#5A3825",
    "#DC2626",
    "#F472B6",
    "#2563EB",
    "#16A34A",
    "#656D4A",
    "#A78BFA",
  ],
  avoidColors: [
    "#C55353",
    "#E06D2D",
    "#E3BA43",
    "#F6A8B4",
    "#9D78C6",
    "#88D49E",
    "#6BA4E8",
    "#D1D5DB",
    "#D6C29E",
  ],
  preferredFit: "Regular",
  outfitStyle: "Simple",
  occasions: ["Work"],
  minTemp: 18,
  maxTemp: 28,
  preferWarmer: true,
  preferLighter: false,
};

async function ensureTable() {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS user_preferences (
        user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        preferences JSONB NOT NULL DEFAULT '{}'::jsonb,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
  } catch (err) {
    console.warn("Could not ensure user_preferences table:", err.message);
  }
}

// GET /api/profile/preferences
export async function GET(request) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser || !authUser.userId) {
      return NextResponse.json({
        success: true,
        preferences: DEFAULT_PREFERENCES,
        source: "default",
      });
    }

    await ensureTable();

    const res = await query(
      `SELECT preferences FROM user_preferences WHERE user_id = $1`,
      [authUser.userId]
    );

    if (res.rows.length > 0 && res.rows[0].preferences) {
      return NextResponse.json({
        success: true,
        preferences: { ...DEFAULT_PREFERENCES, ...res.rows[0].preferences },
        source: "db",
      });
    }

    return NextResponse.json({
      success: true,
      preferences: DEFAULT_PREFERENCES,
      source: "default",
    });
  } catch (error) {
    console.warn("Preferences GET error:", error.message);
    return NextResponse.json({
      success: true,
      preferences: DEFAULT_PREFERENCES,
      source: "fallback",
    });
  }
}

// POST /api/profile/preferences
export async function POST(request) {
  try {
    const authUser = getAuthUser(request);
    const body = await request.json();
    const preferences = body.preferences || body;

    if (!authUser || !authUser.userId) {
      // Return ok for guest/dev sessions
      return NextResponse.json({
        success: true,
        preferences,
        source: "memory",
      });
    }

    await ensureTable();

    await query(
      `INSERT INTO user_preferences (user_id, preferences, updated_at)
       VALUES ($1, $2, CURRENT_TIMESTAMP)
       ON CONFLICT (user_id)
       DO UPDATE SET preferences = $2, updated_at = CURRENT_TIMESTAMP`,
      [authUser.userId, JSON.stringify(preferences)]
    );

    return NextResponse.json({
      success: true,
      preferences,
      source: "db",
    });
  } catch (error) {
    console.warn("Preferences POST error:", error.message);
    return NextResponse.json(
      { error: error.message || "Failed to save preferences" },
      { status: 500 }
    );
  }
}
