import uuid
from typing import List, Dict, Any, Optional
from app.schemas.wardrobe import WardrobeItemResponse
from app.schemas.outfits import (
    OutfitRecommendationRequest,
    RecommendedOutfit,
    OutfitScoreDetails,
    OutfitRecommendationResponse
)
from app.services.color_harmony import calculate_harmony_score
from app.services.weather_service import fetch_weather_by_coords

def generate_outfit_recommendations(
    wardrobe_items: List[Dict[str, Any]],
    request: OutfitRecommendationRequest,
    weather_temp: float = 22.0,
    weather_condition: str = "Clear"
) -> List[RecommendedOutfit]:
    """
    Core Wardrobe Recommendation Engine (100% Wardrobe Grounded).
    Combines user's real pieces with weather rules and color harmony.
    """
    if not wardrobe_items:
        return []

    # 1. Group items by category
    tops = [item for item in wardrobe_items if item["category"].lower() == "tops"]
    bottoms = [item for item in wardrobe_items if item["category"].lower() == "bottoms"]
    outerwear = [item for item in wardrobe_items if item["category"].lower() == "outerwear"]
    shoes = [item for item in wardrobe_items if item["category"].lower() == "shoes"]
    dresses = [item for item in wardrobe_items if item["category"].lower() == "dresses"]

    candidates = []

    # Weather constraint rules
    needs_layering = weather_temp < 18.0
    is_very_hot = weather_temp > 28.0

    # 2. Build Top + Bottom combinations
    for top in tops:
        for bottom in bottoms:
            # Color harmony between top and bottom
            top_color = top.get("color_hex") or "#B8860B"
            bottom_color = bottom.get("color_hex") or "#1C1917"
            harmony = calculate_harmony_score(top_color, bottom_color)
            
            # Selected shoes (or first available)
            selected_shoe = shoes[0] if shoes else None
            
            # Selected outerwear if cold
            selected_outerwear = None
            outerwear_score_mod = 0.0
            if needs_layering and outerwear:
                selected_outerwear = outerwear[0]
                out_harmony = calculate_harmony_score(top_color, selected_outerwear.get("color_hex") or "#000000")
                outerwear_score_mod = (out_harmony["score"] - 85.0) * 0.1

            # Weather fit score
            weather_fit = 95.0 if not needs_layering or selected_outerwear else 80.0
            if is_very_hot and "hoodie" in (top.get("name") or "").lower():
                weather_fit -= 20.0

            # Persona matching
            persona_match = 90.0
            if request.persona:
                item_styles = (top.get("occasion") or "") + (bottom.get("occasion") or "")
                if request.persona.lower() in item_styles.lower():
                    persona_match = 98.0

            total_score = round(
                (harmony["score"] * 0.5) + (weather_fit * 0.3) + (persona_match * 0.2) + outerwear_score_mod,
                1
            )

            # Build rationale explanation
            weather_badge = f"{round(weather_temp)}°C • {weather_condition}"
            explanation = (
                f"{top['name']} paired with {bottom['name']} creates a {harmony['type'].lower()} palette. "
                f"{'Layered with ' + selected_outerwear['name'] + ' for ' + str(round(weather_temp)) + '°C weather. ' if selected_outerwear else 'Lightweight and breathable for ' + str(round(weather_temp)) + '°C comfort.'}"
            )

            title = f"{top['name'].split()[0]} & {bottom['name'].split()[0]} Ensemble"

            candidates.append(
                RecommendedOutfit(
                    id=str(uuid.uuid4())[:8],
                    title=title,
                    top=WardrobeItemResponse(**top),
                    bottom=WardrobeItemResponse(**bottom),
                    outerwear=WardrobeItemResponse(**selected_outerwear) if selected_outerwear else None,
                    shoes=WardrobeItemResponse(**selected_shoe) if selected_shoe else None,
                    dress=None,
                    scores=OutfitScoreDetails(
                        color_harmony=harmony["score"],
                        weather_fit=weather_fit,
                        persona_match=persona_match,
                        total_score=total_score
                    ),
                    explanation=explanation,
                    weather_badge=weather_badge,
                    harmony_tag=harmony["type"]
                )
            )

    # 3. Build Dress combinations
    for dress in dresses:
        selected_shoe = shoes[0] if shoes else None
        selected_outerwear = outerwear[0] if (needs_layering and outerwear) else None
        
        weather_fit = 92.0 if not needs_layering or selected_outerwear else 78.0
        harmony_score = 94.0 # Standalone dress is inherently self-harmonious
        persona_match = 92.0
        
        total_score = round((harmony_score * 0.5) + (weather_fit * 0.3) + (persona_match * 0.2), 1)
        weather_badge = f"{round(weather_temp)}°C • {weather_condition}"
        explanation = f"Effortless one-piece {dress['name']} tailored for {request.occasion or 'daily'} occasions."

        candidates.append(
            RecommendedOutfit(
                id=str(uuid.uuid4())[:8],
                title=f"Signature {dress['name']}",
                top=None,
                bottom=None,
                outerwear=WardrobeItemResponse(**selected_outerwear) if selected_outerwear else None,
                shoes=WardrobeItemResponse(**selected_shoe) if selected_shoe else None,
                dress=WardrobeItemResponse(**dress),
                scores=OutfitScoreDetails(
                    color_harmony=harmony_score,
                    weather_fit=weather_fit,
                    persona_match=persona_match,
                    total_score=total_score
                ),
                explanation=explanation,
                weather_badge=weather_badge,
                harmony_tag="Self-Harmonized"
            )
        )

    # 4. Sort by total score descending
    candidates.sort(key=lambda x: x.scores.total_score, reverse=True)

    # Return top 5 best recommendations
    return candidates[:5]
