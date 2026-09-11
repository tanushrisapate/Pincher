from typing import Optional
from fastapi import APIRouter, HTTPException, status, Depends, Query
from app.core.database import get_db_cursor
from app.core.security import get_current_user
from app.schemas.wardrobe import (
    WardrobeItemCreate,
    WardrobeItemUpdate,
    WardrobeItemResponse,
    WardrobeListResponse
)

router = APIRouter(prefix="/api/wardrobe", tags=["Wardrobe"])

@router.get("", response_model=WardrobeListResponse)
async def get_wardrobe_items(
    category: Optional[str] = Query(None, description="Filter by category (tops, bottoms, outerwear, dresses, shoes, accessories)"),
    search: Optional[str] = Query(None, description="Search by item name or color"),
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user["userId"]
    query = "SELECT * FROM wardrobe_items WHERE user_id = %s"
    params = [user_id]

    if category and category.lower() != "all":
        query += " AND LOWER(category) = %s"
        params.append(category.lower())

    if search:
        query += " AND (LOWER(name) LIKE %s OR LOWER(color_name) LIKE %s OR LOWER(subcategory) LIKE %s)"
        search_pattern = f"%{search.lower()}%"
        params.extend([search_pattern, search_pattern, search_pattern])

    query += " ORDER BY created_at DESC"

    with get_db_cursor() as cur:
        cur.execute(query, tuple(params))
        items = cur.fetchall()

    item_responses = [WardrobeItemResponse(**item) for item in items]
    return WardrobeListResponse(
        success=True,
        items=item_responses,
        total=len(item_responses)
    )

@router.post("", response_model=WardrobeItemResponse, status_code=status.HTTP_201_CREATED)
async def create_wardrobe_item(
    item_in: WardrobeItemCreate,
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user["userId"]
    insert_sql = """
    INSERT INTO wardrobe_items (
        user_id, name, category, subcategory, color_hex, color_name, season, occasion, image_url
    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
    RETURNING *;
    """
    with get_db_cursor(commit=True) as cur:
        cur.execute(
            insert_sql,
            (
                user_id,
                item_in.name.strip(),
                item_in.category.lower().strip(),
                item_in.subcategory or "",
                item_in.color_hex or "#B8860B",
                item_in.color_name or "Gold",
                item_in.season or "all",
                item_in.occasion or "casual",
                item_in.image_url
            )
        )
        created = cur.fetchone()

    return WardrobeItemResponse(**created)

@router.get("/{item_id}", response_model=WardrobeItemResponse)
async def get_single_wardrobe_item(
    item_id: int,
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user["userId"]
    with get_db_cursor() as cur:
        cur.execute(
            "SELECT * FROM wardrobe_items WHERE id = %s AND user_id = %s",
            (item_id, user_id)
        )
        item = cur.fetchone()

    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Wardrobe item #{item_id} not found."
        )

    return WardrobeItemResponse(**item)

@router.put("/{item_id}", response_model=WardrobeItemResponse)
async def update_wardrobe_item(
    item_id: int,
    item_update: WardrobeItemUpdate,
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user["userId"]

    # Check existence
    with get_db_cursor() as cur:
        cur.execute("SELECT * FROM wardrobe_items WHERE id = %s AND user_id = %s", (item_id, user_id))
        existing = cur.fetchone()

    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Wardrobe item #{item_id} not found."
        )

    # Build dynamic update statement
    update_fields = []
    params = []
    for field, val in item_update.model_dump(exclude_unset=True).items():
        if val is not None:
            update_fields.append(f"{field} = %s")
            params.append(val)

    if not update_fields:
        return WardrobeItemResponse(**existing)

    update_fields.append("updated_at = CURRENT_TIMESTAMP")
    params.extend([item_id, user_id])

    update_sql = f"""
    UPDATE wardrobe_items
    SET {', '.join(update_fields)}
    WHERE id = %s AND user_id = %s
    RETURNING *;
    """

    with get_db_cursor(commit=True) as cur:
        cur.execute(update_sql, tuple(params))
        updated = cur.fetchone()

    return WardrobeItemResponse(**updated)

@router.delete("/{item_id}")
async def delete_wardrobe_item(
    item_id: int,
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user["userId"]
    with get_db_cursor(commit=True) as cur:
        cur.execute(
            "DELETE FROM wardrobe_items WHERE id = %s AND user_id = %s RETURNING id",
            (item_id, user_id)
        )
        deleted = cur.fetchone()

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Wardrobe item #{item_id} not found."
        )

    return {"success": True, "message": f"Wardrobe item #{item_id} deleted successfully."}
