from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field
from app.schemas.wardrobe import WardrobeItemResponse

class OutfitRecommendationRequest(BaseModel):
    occasion: Optional[str] = "daily"
    day_of_week: Optional[str] = None
    temperature: Optional[float] = None
    weather_condition: Optional[str] = "Clear"
    preferred_color: Optional[str] = None
    avoid_color: Optional[str] = None
    persona: Optional[str] = None
    max_packets: Optional[int] = 5
    strict_weather: Optional[bool] = True

class OutfitScoreDetails(BaseModel):
    color_harmony: float
    weather_fit: float
    persona_match: float
    total_score: float

class RecommendedOutfit(BaseModel):
    id: str
    packet_number: int = 1
    title: str
    day_of_week: Optional[str] = None
    occasion: str = "casual"
    top: Optional[WardrobeItemResponse] = None
    bottom: Optional[WardrobeItemResponse] = None
    outerwear: Optional[WardrobeItemResponse] = None
    shoes: Optional[WardrobeItemResponse] = None
    accessories: List[WardrobeItemResponse] = []
    dress: Optional[WardrobeItemResponse] = None
    scores: OutfitScoreDetails
    explanation: str
    weather_badge: str
    harmony_tag: str
    weather_rules_applied: List[str] = []

class OutfitRecommendationResponse(BaseModel):
    success: bool
    weather_context: Dict[str, Any]
    total_packets: int = 0
    recommendations: List[RecommendedOutfit]

class OutfitSaveRequest(BaseModel):
    title: str
    top_item_id: Optional[int] = None
    bottom_item_id: Optional[int] = None
    outerwear_item_id: Optional[int] = None
    shoes_item_id: Optional[int] = None
    accessory_item_id: Optional[int] = None
    occasion: Optional[str] = "daily"
    season: Optional[str] = "all"
    weather_temp: Optional[float] = None
    weather_condition: Optional[str] = None
    harmony_score: Optional[float] = 85.0
    explanation: Optional[str] = None

class OutfitCollectionResponse(BaseModel):
    id: int
    user_id: int
    title: str
    top_item_id: Optional[int]
    bottom_item_id: Optional[int]
    outerwear_item_id: Optional[int]
    shoes_item_id: Optional[int]
    accessory_item_id: Optional[int]
    occasion: Optional[str]
    season: Optional[str]
    weather_temp: Optional[float]
    weather_condition: Optional[str]
    harmony_score: Optional[float]
    explanation: Optional[str]
    is_favorite: Optional[bool]
    created_at: Optional[datetime]
