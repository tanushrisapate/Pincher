from typing import Optional, List, Dict, Any
from fastapi import APIRouter, HTTPException, status, Depends
from app.core.database import get_db_cursor
from app.core.security import get_current_user
from app.schemas.wardrobe import WardrobeItemResponse
from app.schemas.outfits import (
    OutfitRecommendationRequest,
    OutfitRecommendationResponse,
    OutfitSaveRequest,
    OutfitCollectionResponse
)
from app.services.recommender import generate_outfit_recommendations

router = APIRouter(prefix="/api/outfits", tags=["Outfits & Recommendations"])

@router.post("/recommend", response_model=OutfitRecommendationResponse)
async def recommend_outfits(
    request: OutfitRecommendationRequest,
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user["userId"]
    persona = request.persona or current_user.get("persona", "classic")
    request.persona = persona

    # 1. Fetch user's wardrobe items
    with get_db_cursor() as cur:
        cur.execute("SELECT * FROM wardrobe_items WHERE user_id = %s", (user_id,))
        items = cur.fetchall()

    if not items:
        return OutfitRecommendationResponse(
            success=True,
            weather_context={
                "temperature": request.temperature or 22.0,
                "condition": request.weather_condition or "Clear",
                "message": "No wardrobe items found. Please upload items first to get personalized outfit recommendations."
            },
            recommendations=[]
        )

    # 2. Run recommendation engine
    temp = request.temperature if request.temperature is not None else 22.0
    cond = request.weather_condition or "Clear"
    
    recommendations = generate_outfit_recommendations(
        wardrobe_items=items,
        request=request,
        weather_temp=temp,
        weather_condition=cond
    )

    return OutfitRecommendationResponse(
        success=True,
        weather_context={
            "temperature": temp,
            "condition": cond,
            "occasion": request.occasion,
            "persona": persona
        },
        recommendations=recommendations
    )

@router.post("/save", status_code=status.HTTP_201_CREATED)
async def save_outfit(
    outfit_in: OutfitSaveRequest,
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user["userId"]
    insert_sql = """
    INSERT INTO outfit_collections (
        user_id, title, top_item_id, bottom_item_id, outerwear_item_id,
        shoes_item_id, accessory_item_id, occasion, season,
        weather_temp, weather_condition, harmony_score, explanation
    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    RETURNING *;
    """
    with get_db_cursor(commit=True) as cur:
        cur.execute(
            insert_sql,
            (
                user_id,
                outfit_in.title,
                outfit_in.top_item_id,
                outfit_in.bottom_item_id,
                outfit_in.outerwear_item_id,
                outfit_in.shoes_item_id,
                outfit_in.accessory_item_id,
                outfit_in.occasion,
                outfit_in.season,
                outfit_in.weather_temp,
                outfit_in.weather_condition,
                outfit_in.harmony_score,
                outfit_in.explanation
            )
        )
        saved = cur.fetchone()

    return {
        "success": True,
        "message": "Outfit saved to collection successfully.",
        "outfit": OutfitCollectionResponse(**saved)
    }

@router.get("/saved")
async def get_saved_outfits(current_user: dict = Depends(get_current_user)):
    user_id = current_user["userId"]
    query = """
    SELECT 
        o.*,
        row_to_json(top_item.*) AS top,
        row_to_json(bot_item.*) AS bottom,
        row_to_json(out_item.*) AS outerwear,
        row_to_json(shoe_item.*) AS shoes,
        row_to_json(acc_item.*) AS accessory
    FROM outfit_collections o
    LEFT JOIN wardrobe_items top_item ON o.top_item_id = top_item.id
    LEFT JOIN wardrobe_items bot_item ON o.bottom_item_id = bot_item.id
    LEFT JOIN wardrobe_items out_item ON o.outerwear_item_id = out_item.id
    LEFT JOIN wardrobe_items shoe_item ON o.shoes_item_id = shoe_item.id
    LEFT JOIN wardrobe_items acc_item ON o.accessory_item_id = acc_item.id
    WHERE o.user_id = %s
    ORDER BY o.created_at DESC;
    """
    with get_db_cursor() as cur:
        cur.execute(query, (user_id,))
        rows = cur.fetchall()

    return {
        "success": True,
        "outfits": rows,
        "total": len(rows)
    }

@router.delete("/{outfit_id}")
async def delete_saved_outfit(
    outfit_id: int,
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user["userId"]
    with get_db_cursor(commit=True) as cur:
        cur.execute(
            "DELETE FROM outfit_collections WHERE id = %s AND user_id = %s RETURNING id",
            (outfit_id, user_id)
        )
        deleted = cur.fetchone()

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Outfit #{outfit_id} not found."
        )

    return {"success": True, "message": f"Outfit #{outfit_id} deleted successfully."}

@router.patch("/{outfit_id}/favorite")
async def toggle_outfit_favorite(
    outfit_id: int,
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user["userId"]
    with get_db_cursor(commit=True) as cur:
        cur.execute(
            """
            UPDATE outfit_collections
            SET is_favorite = NOT is_favorite
            WHERE id = %s AND user_id = %s
            RETURNING id, is_favorite;
            """,
            (outfit_id, user_id)
        )
        updated = cur.fetchone()

    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Outfit #{outfit_id} not found."
        )

    return {
        "success": True,
        "outfit_id": updated["id"],
        "is_favorite": updated["is_favorite"]
    }
