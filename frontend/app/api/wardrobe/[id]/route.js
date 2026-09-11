import { NextResponse } from 'next/server';
import { query } from '@/app/lib/db';
import { getAuthUser } from '@/app/lib/auth';

// DELETE /api/wardrobe/[id] - Remove an item from user's wardrobe
export async function DELETE(request, { params }) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser || !authUser.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const res = await query(
      'DELETE FROM wardrobe_items WHERE id = $1 AND user_id = $2 RETURNING id, name',
      [id, authUser.userId]
    );

    if (res.rows.length === 0) {
      return NextResponse.json(
        { error: 'Item not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Item "${res.rows[0].name}" deleted successfully`,
      deletedId: res.rows[0].id,
    });
  } catch (error) {
    console.error('Delete Wardrobe Item Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete wardrobe item' },
      { status: 500 }
    );
  }
}

// PUT /api/wardrobe/[id] - Update item metadata
export async function PUT(request, { params }) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser || !authUser.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { name, category, subcategory, color_hex, color_name, season, occasion } = body;

    const res = await query(
      `UPDATE wardrobe_items 
       SET name = COALESCE($1, name),
           category = COALESCE($2, category),
           subcategory = COALESCE($3, subcategory),
           color_hex = COALESCE($4, color_hex),
           color_name = COALESCE($5, color_name),
           season = COALESCE($6, season),
           occasion = COALESCE($7, occasion),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $8 AND user_id = $9
       RETURNING *`,
      [name, category, subcategory, color_hex, color_name, season, occasion, id, authUser.userId]
    );

    if (res.rows.length === 0) {
      return NextResponse.json(
        { error: 'Item not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Item updated successfully',
      item: res.rows[0],
    });
  } catch (error) {
    console.error('Update Wardrobe Item Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update wardrobe item' },
      { status: 500 }
    );
  }
}
