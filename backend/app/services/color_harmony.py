import colorsys
import math
from typing import Tuple, Dict, Any

def hex_to_rgb(hex_code: str) -> Tuple[int, int, int]:
    hex_code = hex_code.lstrip("#")
    if len(hex_code) == 3:
        hex_code = "".join(2 * c for c in hex_code)
    try:
        return tuple(int(hex_code[i:i+2], 16) for i in (0, 2, 4))
    except Exception:
        return (184, 134, 11) # fallback gold

def rgb_to_hsl(r: int, g: int, b: int) -> Tuple[float, float, float]:
    r_norm, g_norm, b_norm = r / 255.0, g / 255.0, b / 255.0
    h, l, s = colorsys.rgb_to_hls(r_norm, g_norm, b_norm)
    return (h * 360.0, s * 100.0, l * 100.0)

def is_neutral(r: int, g: int, b: int) -> bool:
    """Checks if a color is black, white, gray, beige, navy, or brown"""
    h, s, l = rgb_to_hsl(r, g, b)
    if s < 15 or l < 15 or l > 88:
        return True
    # Navy
    if 210 <= h <= 245 and l < 30:
        return True
    # Khaki / Beige
    if 30 <= h <= 55 and s < 45 and l > 60:
        return True
    return False

def calculate_harmony_score(hex1: str, hex2: str) -> Dict[str, Any]:
    """
    Calculates color harmony score (0 - 100) between two clothing items.
    Follows fashion color theory:
    - Neutral + Any Color = 90 - 95%
    - Neutral + Neutral = 90 - 98%
    - Analogous (Hue diff 20 - 45 deg) = 90 - 95%
    - Complementary (Hue diff 160 - 200 deg) = 88 - 94%
    - Monochromatic (Same hue, diff lightness) = 92 - 96%
    """
    rgb1 = hex_to_rgb(hex1)
    rgb2 = hex_to_rgb(hex2)
    
    neutral1 = is_neutral(*rgb1)
    neutral2 = is_neutral(*rgb2)
    
    h1, s1, l1 = rgb_to_hsl(*rgb1)
    h2, s2, l2 = rgb_to_hsl(*rgb2)
    
    # Neutral pair or neutral anchor
    if neutral1 and neutral2:
        # Check contrast so it's not washed out
        diff_l = abs(l1 - l2)
        score = 88.0 + min(diff_l * 0.15, 10.0)
        return {"score": round(score, 1), "type": "Balanced Neutral", "description": "Timeless clean neutral combination"}
        
    if neutral1 or neutral2:
        return {"score": 93.5, "type": "Neutral Accent", "description": "Neutral base allows the statement piece to shine"}
        
    # Both are vibrant colors
    hue_diff = abs(h1 - h2)
    if hue_diff > 180:
        hue_diff = 360 - hue_diff
        
    # Monochromatic
    if hue_diff < 15:
        lightness_contrast = abs(l1 - l2)
        score = 85.0 + min(lightness_contrast * 0.15, 12.0)
        return {"score": round(score, 1), "type": "Monochromatic", "description": "Unified tonal harmony with depth"}
        
    # Analogous (Adjacent on color wheel)
    if 15 <= hue_diff <= 50:
        return {"score": 92.0, "type": "Analogous", "description": "Harmonious adjacent color flow"}
        
    # Complementary (Opposite on color wheel)
    if 150 <= hue_diff <= 210:
        return {"score": 90.0, "type": "Complementary", "description": "Striking high-contrast balanced pairing"}
        
    # Triadic
    if 105 <= hue_diff <= 135:
        return {"score": 86.0, "type": "Triadic", "description": "Dynamic colorful balance"}
        
    # Moderate clash
    return {"score": 75.0, "type": "Contrast", "description": "Bold contrasting statement"}
