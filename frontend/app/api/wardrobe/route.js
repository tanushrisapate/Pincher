import { NextResponse } from 'next/server';
import { query } from '@/app/lib/db';
import { getDemoUserId } from '@/app/lib/demoUser';

// GET /api/wardrobe - Retrieve user's wardrobe items with optional filters
export async function GET(request) {
  try {
    const demoUserId = await getDemoUserId();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const season = searchParams.get('season');
    const search = searchParams.get('search');

    let sql = 'SELECT * FROM wardrobe_items WHERE user_id = $1';
    const params = [demoUserId];
    let paramIndex = 2;

    if (category && category !== 'all') {
      sql += ` AND LOWER(category) = LOWER($${paramIndex})`;
      params.push(category);
      paramIndex++;
    }

    if (season && season !== 'all') {
      sql += ` AND (LOWER(season) = LOWER($${paramIndex}) OR LOWER(season) = 'all')`;
      params.push(season);
      paramIndex++;
    }

    if (search && search.trim()) {
      sql += ` AND (LOWER(name) LIKE $${paramIndex} OR LOWER(subcategory) LIKE $${paramIndex} OR LOWER(color_name) LIKE $${paramIndex})`;
      params.push(`%${search.trim().toLowerCase()}%`);
      paramIndex++;
    }

    sql += ' ORDER BY created_at DESC';

    const res = await query(sql, params);

    return NextResponse.json({
      success: true,
      items: res.rows,
      total: res.rows.length,
    });
  } catch (error) {
    console.error('Fetch Wardrobe Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch wardrobe items' },
      { status: 500 }
    );
  }
}

// POST /api/wardrobe - Add a new wardrobe item
export async function POST(request) {
  try {
    const demoUserId = await getDemoUserId();

    const body = await request.json();
    const {
      name,
      category,
      subcategory,
      color_hex,
      color_name,
      season,
      occasion,
      image_url,
    } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Item name is required' }, { status: 400 });
    }

    if (!category) {
      return NextResponse.json({ error: 'Category is required' }, { status: 400 });
    }

    if (!image_url) {
      return NextResponse.json({ error: 'Image is required' }, { status: 400 });
    }

    const insertSql = `
      INSERT INTO wardrobe_items (
        user_id, name, category, subcategory, color_hex, color_name, season, occasion, image_url
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;

    const res = await query(insertSql, [
      demoUserId,
      name.trim(),
      category.toLowerCase(),
      subcategory ? subcategory.toLowerCase() : null,
      color_hex || '#B8860B',
      color_name || 'Gold',
      season ? season.toLowerCase() : 'all',
      occasion ? occasion.toLowerCase() : 'casual',
      image_url,
    ]);

    return NextResponse.json(
      {
        success: true,
        message: 'Item added to wardrobe successfully',
        item: res.rows[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create Wardrobe Item Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create wardrobe item' },
      { status: 500 }
    );
  }
}
