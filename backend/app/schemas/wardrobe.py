from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field

class WardrobeItemBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    category: str = Field(..., description="tops, bottoms, outerwear, dresses, shoes, accessories")
    subcategory: Optional[str] = None
    color_hex: Optional[str] = "#B8860B"
    color_name: Optional[str] = "Gold"
    season: Optional[str] = "all"
    occasion: Optional[str] = "casual"
    image_url: str

class WardrobeItemCreate(WardrobeItemBase):
    pass

class WardrobeItemUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    subcategory: Optional[str] = None
    color_hex: Optional[str] = None
    color_name: Optional[str] = None
    season: Optional[str] = None
    occasion: Optional[str] = None

class WardrobeItemResponse(WardrobeItemBase):
    id: int
    user_id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

class WardrobeListResponse(BaseModel):
    success: bool
    items: List[WardrobeItemResponse]
    total: int
