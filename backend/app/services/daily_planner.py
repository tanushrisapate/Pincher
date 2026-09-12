from typing import Dict, Any, List, Optional
from datetime import datetime

DAY_STYLE_PROFILES = {
    'monday': {
        'label': 'Monday Focus',
        'vibe': 'Sharp, Executive and Focused',
        'default_occasion': 'formal',
        'formality_weight': 1.3,
        'preferred_items': ['blazer', 'trousers', 'oxford', 'dress shirt', 'formal', 'watch', 'suit'],
        'avoid_items': ['joggers', 'flip-flops', 'tank']
    },
    'tuesday': {
        'label': 'Tuesday Productivity',
        'vibe': 'Sleek Smart Casual and Modern Structure',
        'default_occasion': 'formal',
        'formality_weight': 1.1,
        'preferred_items': ['chinos', 'knit', 'polo', 'loafer', 'sweater', 'leather bag'],
        'avoid_items': ['swim', 'beach']
    },
    'wednesday': {
        'label': 'Wednesday Midweek Balance',
        'vibe': 'Contemporary Smart and Versatile',
        'default_occasion': 'casual',
        'formality_weight': 0.9,
        'preferred_items': ['denim', 'flannel', 'cardigan', 'clean sneakers', 'overshirt'],
        'avoid_items': []
    },
    'thursday': {
        'label': 'Thursday Creative Layering',
        'vibe': 'Elevated Contemporary and Textured Silhouettes',
        'default_occasion': 'casual',
        'formality_weight': 0.95,
        'preferred_items': ['jacket', 'trench', 'accessories', 'boots', 'sunglasses', 'tote'],
        'avoid_items': []
    },
    'friday': {
        'label': 'Friday Desk-to-Dinner',
        'vibe': 'Casual Friday transitioning to Evening Social',
        'default_occasion': 'party',
        'formality_weight': 1.0,
        'preferred_items': ['leather jacket', 'dark jeans', 'chic boots', 'evening top', 'statement bag'],
        'avoid_items': []
    },
    'saturday': {
        'label': 'Saturday Social and Outdoor',
        'vibe': 'Vibrant, Expressive and Relaxed',
        'default_occasion': 'outdoor',
        'formality_weight': 0.6,
        'preferred_items': ['hoodie', 'sneakers', 'bomber', 'crossbody', 'sunglasses', 'cap'],
        'avoid_items': ['formal suit', 'tie']
    },
    'sunday': {
        'label': 'Sunday Reset and Brunch',
        'vibe': 'Effortless Luxury and Soft Comfort',
        'default_occasion': 'daily',
        'formality_weight': 0.5,
        'preferred_items': ['linen', 'cotton tee', 'slip-on', 'relaxed knit', 'cozy cardigan'],
        'avoid_items': ['stiff collar', 'heavy formal']
    }
}

def get_day_profile(day_name: Optional[str] = None) -> Dict[str, Any]:
    if not day_name:
        day_name = datetime.now().strftime('%A').lower()
    day_key = day_name.strip().lower()
    return DAY_STYLE_PROFILES.get(day_key, DAY_STYLE_PROFILES['monday'])

def score_item_for_day(item: Dict[str, Any], day_profile: Dict[str, Any]) -> float:
    name = (item.get('name') or '').lower()
    subcat = (item.get('subcategory') or '').lower()
    occasion = (item.get('occasion') or '').lower()
    text = f'{name} {subcat} {occasion}'

    score = 75.0
    for pref in day_profile.get('preferred_items', []):
        if pref in text:
            score += 15.0
            break

    for avoid in day_profile.get('avoid_items', []):
        if avoid in text:
            score -= 25.0
            break

    return min(100.0, max(40.0, score))
