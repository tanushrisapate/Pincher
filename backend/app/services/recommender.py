import uuid
import re
from typing import List, Dict, Any, Optional
from app.schemas.wardrobe import WardrobeItemResponse
from app.schemas.outfits import (
    OutfitRecommendationRequest,
    RecommendedOutfit,
    OutfitScoreDetails,
)
from app.services.color_harmony import calculate_harmony_score
from app.services.daily_planner import get_day_profile, score_item_for_day


COLD_TOP_KEYWORDS = {
    "sweater", "hoodie", "cardigan", "sweatshirt", "long sleeve", "long-sleeve",
    "knit", "pullover", "turtleneck", "flannel", "fleece", "jacket", "thermal", "wool"
}

COLD_BOTTOM_EXCLUDED = {
    "short", "shorts", "mini", "swim", "bermuda", "hotpants"
}

HOT_TOP_EXCLUDED = {
    "heavy wool", "puffer", "thick knit", "fleece hoodie", "heavy sweater", "thermal"
}

COLD_SHOE_EXCLUDED = {
    "sandal", "sandals", "flip flop", "flip-flop", "slides", "open toe", "crocs"
}


def is_item_condition_match(item: Dict[str, Any], target_condition: str) -> bool:
    """Check if an item's occasion or text attributes match the target condition."""
    if not target_condition or target_condition.lower() in ("daily", "all", "any"):
        return True

    item_occasion = (item.get("occasion") or "casual").lower()
    item_name = (item.get("name") or "").lower()
    item_subcat = (item.get("subcategory") or "").lower()
    full_text = f"{item_occasion} {item_name} {item_subcat}"

    target = target_condition.lower()
    if target in item_occasion or item_occasion == "all" or item_occasion == "daily":
        return True

    if target in ("formal", "work", "office", "business"):
        return any(k in full_text for k in ["formal", "office", "blazer", "suit", "oxford", "trousers", "work", "dress shirt"])
    elif target in ("party", "date", "evening"):
        return any(k in full_text for k in ["party", "evening", "dress", "date", "silk", "heels", "blazer", "chic", "glam"])
    elif target in ("outdoor", "active", "workout", "sports"):
        return any(k in full_text for k in ["outdoor", "sports", "active", "gym", "hiking", "jacket", "sneakers", "hoodie"])
    elif target in ("casual", "daily"):
        return any(k in full_text for k in ["casual", "daily", "jeans", "tee", "t-shirt", "sneakers", "hoodie", "sweater"])

    return True


def is_cold_safe_top(item: Dict[str, Any]) -> bool:
    """Returns True if top is warm / long-sleeved for cold weather."""
    name = (item.get("name") or "").lower()
    subcat = (item.get("subcategory") or "").lower()
    text = f"{name} {subcat}"
    return any(k in text for k in COLD_TOP_KEYWORDS) or ("shirt" in text and "short" not in text and "sleeveless" not in text)


def is_cold_safe_bottom(item: Dict[str, Any]) -> bool:
    """Strictly disallows shorts / mini-skirts when cold."""
    name = (item.get("name") or "").lower()
    subcat = (item.get("subcategory") or "").lower()
    text = f"{name} {subcat}"
    return not any(ex in text for ex in COLD_BOTTOM_EXCLUDED)


def is_cold_safe_shoe(item: Dict[str, Any]) -> bool:
    """Disallows open-toe sandals/slides in cold weather."""
    name = (item.get("name") or "").lower()
    subcat = (item.get("subcategory") or "").lower()
    text = f"{name} {subcat}"
    return not any(ex in text for ex in COLD_SHOE_EXCLUDED)


def generate_outfit_recommendations(
    wardrobe_items: List[Dict[str, Any]],
    request: OutfitRecommendationRequest,
    weather_temp: float = 22.0,
    weather_condition: str = "Clear"
) -> List[RecommendedOutfit]:
    """
    Condition-Based Outfit Packet & Set Generator Engine.
    Filters wardrobe by occasion condition, enforces climate safety protocols,
    and bundles coordinated sets (Top + Bottom + Outerwear + Shoes + Accessories).
    """
    if not wardrobe_items:
        return []

    target_occasion = request.occasion or "casual"
    is_cold = weather_temp < 18.0
    is_hot = weather_temp > 26.0
    max_packets = request.max_packets or 5

    day_prof = get_day_profile(request.day_of_week)
    
    # 1. Separate by Category & Score by Day Preference
    raw_tops = sorted([i for i in wardrobe_items if i["category"].lower() == "tops"], key=lambda x: score_item_for_day(x, day_prof), reverse=True)
    raw_bottoms = sorted([i for i in wardrobe_items if i["category"].lower() == "bottoms"], key=lambda x: score_item_for_day(x, day_prof), reverse=True)
    raw_outerwear = sorted([i for i in wardrobe_items if i["category"].lower() == "outerwear"], key=lambda x: score_item_for_day(x, day_prof), reverse=True)
    raw_shoes = sorted([i for i in wardrobe_items if i["category"].lower() == "shoes"], key=lambda x: score_item_for_day(x, day_prof), reverse=True)
    raw_accessories = sorted([i for i in wardrobe_items if i["category"].lower() == "accessories"], key=lambda x: score_item_for_day(x, day_prof), reverse=True)
    raw_dresses = sorted([i for i in wardrobe_items if i["category"].lower() == "dresses"], key=lambda x: score_item_for_day(x, day_prof), reverse=True)

    # 2. Filter by Condition & Weather Rules
    is_rainy = any(w in weather_condition.lower() for w in ["rain", "drizzle", "shower", "monsoon", "storm", "wet"])
    is_snowy = any(w in weather_condition.lower() for w in ["snow", "blizzard", "frost", "ice", "freezing"]) or weather_temp < 6.0
    is_windy = any(w in weather_condition.lower() for w in ["wind", "breezy", "gust"])

    # Tops filtering
    filtered_tops = [t for t in raw_tops if is_item_condition_match(t, target_occasion)]
    if not filtered_tops:
        filtered_tops = raw_tops
    
    if (is_cold or is_snowy) and request.strict_weather:
        cold_tops = [t for t in filtered_tops if is_cold_safe_top(t)]
        if cold_tops:
            filtered_tops = cold_tops

    # Bottoms filtering
    filtered_bottoms = [b for b in raw_bottoms if is_item_condition_match(b, target_occasion)]
    if not filtered_bottoms:
        filtered_bottoms = raw_bottoms
        
    if (is_cold or is_snowy or is_rainy) and request.strict_weather:
        # Strictly exclude shorts & mini-skirts in cold or rain
        cold_bottoms = [b for b in filtered_bottoms if is_cold_safe_bottom(b)]
        if cold_bottoms:
            filtered_bottoms = cold_bottoms

    # Outerwear filtering
    filtered_outerwear = [o for o in raw_outerwear if is_item_condition_match(o, target_occasion)]
    if not filtered_outerwear:
        filtered_outerwear = raw_outerwear

    # Shoes filtering
    filtered_shoes = [s for s in raw_shoes if is_item_condition_match(s, target_occasion)]
    if not filtered_shoes:
        filtered_shoes = raw_shoes
        
    if (is_cold or is_snowy or is_rainy) and request.strict_weather:
        cold_shoes = [s for s in filtered_shoes if is_cold_safe_shoe(s)]
        if cold_shoes:
            filtered_shoes = cold_shoes

    # Accessories filtering
    filtered_accessories = [a for a in raw_accessories if is_item_condition_match(a, target_occasion)]
    if not filtered_accessories:
        filtered_accessories = raw_accessories

    # Active safety rules summary
    active_rules = []
    if is_cold or is_snowy:
        active_rules.append(f"❄️ Full-sleeve warm top enforced (<18°C)")
        active_rules.append("🚫 Shorts & mini skirts filtered out")
        active_rules.append("🧥 Mandatory outerwear layer attached")
        active_rules.append("👟 Closed footwear matched")
    elif is_rainy:
        active_rules.append("🌧️ Rain protection & water-safe boots active")
    elif is_hot:
        active_rules.append("☀️ Breathable lightweight fabrics prioritized")

    # 3. Formulate Coordinated Packets
    packets = []
    packet_counter = 1

    for top in filtered_tops:
        if packet_counter > max_packets:
            break

        best_bottom = None
        best_harmony = None
        best_harmony_score = -1.0

        for bottom in filtered_bottoms:
            harmony = calculate_harmony_score(top.get("color_hex"), bottom.get("color_hex"))
            if harmony["score"] > best_harmony_score:
                best_harmony_score = harmony["score"]
                best_bottom = bottom
                best_harmony = harmony

        if not best_bottom:
            continue

        selected_outerwear = None
        if is_cold or is_snowy or is_rainy or (request.strict_weather and weather_temp < 20.0):
            if filtered_outerwear:
                selected_outerwear = filtered_outerwear[(packet_counter - 1) % len(filtered_outerwear)]
        elif filtered_outerwear and packet_counter % 2 == 1:
            selected_outerwear = filtered_outerwear[(packet_counter - 1) % len(filtered_outerwear)]

        selected_shoe = None
        if filtered_shoes:
            selected_shoe = filtered_shoes[(packet_counter - 1) % len(filtered_shoes)]

        assigned_accessories = []
        if filtered_accessories:
            acc_slice = filtered_accessories[(packet_counter - 1) % len(filtered_accessories):(packet_counter + 1) % len(filtered_accessories) + 1]
            if not acc_slice:
                acc_slice = [filtered_accessories[0]]
            assigned_accessories = [WardrobeItemResponse(**a) for a in acc_slice[:2]]

        # Calculate multi-tier scores
        harmony_score = best_harmony["score"] if best_harmony else 90.0
        weather_fit = 96.0 if (not is_cold or selected_outerwear or is_cold_safe_top(top)) else 82.0
        condition_match = 95.0

        total_score = round((harmony_score * 0.45) + (weather_fit * 0.35) + (condition_match * 0.2), 1)

        title = f"{day_prof['label']} • Set #{packet_counter}"
        
        acc_text = f" Completed with {', '.join([a.name for a in assigned_accessories])}." if assigned_accessories else ""
        layer_text = f" Bundled with {selected_outerwear['name']} for thermal protection." if selected_outerwear else ""
        explanation = (
            f"100% Grounded {target_occasion.title()} Packet for {day_prof['label']}. {top['name']} paired with {best_bottom['name']} "
            f"creates a {best_harmony['type'].lower()} color palette.{layer_text}{acc_text}"
        )

        weather_badge = f"{round(weather_temp)}°C • {weather_condition}"

        packets.append(
            RecommendedOutfit(
                id=str(uuid.uuid4())[:8],
                packet_number=packet_counter,
                title=title,
                day_of_week=day_prof["label"],
                occasion=target_occasion,
                top=WardrobeItemResponse(**top),
                bottom=WardrobeItemResponse(**best_bottom),
                outerwear=WardrobeItemResponse(**selected_outerwear) if selected_outerwear else None,
                shoes=WardrobeItemResponse(**selected_shoe) if selected_shoe else None,
                accessories=assigned_accessories,
                dress=None,
                scores=OutfitScoreDetails(
                    color_harmony=harmony_score,
                    weather_fit=weather_fit,
                    persona_match=condition_match,
                    total_score=total_score
                ),
                explanation=explanation,
                weather_badge=weather_badge,
                harmony_tag=best_harmony["type"] if best_harmony else "Harmonious",
                weather_rules_applied=active_rules
            )
        )
        packet_counter += 1

    # 5. Build One-Piece Dress Packets if available
    filtered_dresses = [d for d in raw_dresses if is_item_condition_match(d, target_occasion)]
    for dress in filtered_dresses:
        if packet_counter > max_packets:
            break

        if is_cold and "short" in (dress.get("name") or "").lower():
            continue

        selected_outerwear = filtered_outerwear[(packet_counter - 1) % len(filtered_outerwear)] if (is_cold and filtered_outerwear) else None
        selected_shoe = filtered_shoes[(packet_counter - 1) % len(filtered_shoes)] if filtered_shoes else None
        
        assigned_accessories = []
        if filtered_accessories:
            acc_slice = filtered_accessories[:2]
            assigned_accessories = [WardrobeItemResponse(**a) for a in acc_slice]

        harmony_score = 95.0
        weather_fit = 94.0 if not is_cold or selected_outerwear else 80.0
        condition_match = 96.0
        total_score = round((harmony_score * 0.45) + (weather_fit * 0.35) + (condition_match * 0.2), 1)

        title = f"Packet #{packet_counter} • Signature {dress['name']} Set"
        explanation = (
            f"Curated one-piece {target_occasion.title()} ensemble featuring {dress['name']}. "
            f"{'Layered with ' + selected_outerwear['name'] + ' for ' + str(round(weather_temp)) + '°C warmth.' if selected_outerwear else 'Light and elegant for ' + str(round(weather_temp)) + '°C weather.'}"
        )

        packets.append(
            RecommendedOutfit(
                id=str(uuid.uuid4())[:8],
                packet_number=packet_counter,
                title=title,
                occasion=target_occasion,
                top=None,
                bottom=None,
                outerwear=WardrobeItemResponse(**selected_outerwear) if selected_outerwear else None,
                shoes=WardrobeItemResponse(**selected_shoe) if selected_shoe else None,
                accessories=assigned_accessories,
                dress=WardrobeItemResponse(**dress),
                scores=OutfitScoreDetails(
                    color_harmony=harmony_score,
                    weather_fit=weather_fit,
                    persona_match=condition_match,
                    total_score=total_score
                ),
                explanation=explanation,
                weather_badge=f"{round(weather_temp)}°C • {weather_condition}",
                harmony_tag="Self-Harmonized",
                weather_rules_applied=active_rules
            )
        )
        packet_counter += 1

    # Sort packets by total score descending
    packets.sort(key=lambda x: x.scores.total_score, reverse=True)
    return packets[:max_packets]
