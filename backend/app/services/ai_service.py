from typing import Any

REFERENCE_STYLES = {
    "1": {"name": "Zendaya", "style": "Sharp evening wear", "img": "https://images.unsplash.com/photo-1488161628813-04466f872be2?w=400&q=80"},
    "2": {"name": "Harry Styles", "style": "Expressive tailoring", "img": "https://images.unsplash.com/photo-1492288991661-058aa541ff43?w=400&q=80"},
    "3": {"name": "Rihanna", "style": "Statement streetwear", "img": "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&q=80"},
    "4": {"name": "Timothee Chalamet", "style": "Soft modern formal", "img": "https://images.unsplash.com/photo-1463453091185-61582044d556?w=400&q=80"},
    "5": {"name": "Bella Hadid", "style": "90s minimal", "img": "https://images.unsplash.com/photo-1521146764736-56c929d59c83?w=400&q=80"},
    "6": {"name": "A$AP Rocky", "style": "Layered luxury streetwear", "img": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80"},
}


def build_style_report(
    image_url: str,
    colors: list[str],
    icons: list[str],
    tags: list[str],
) -> dict[str, Any]:
    primary_tag = tags[0] if tags else "Minimal"
    aesthetic = _aesthetic_from_tag(primary_tag)
    confidence = min(94, 72 + len(colors) * 3 + len(icons) * 2 + len(tags))
    palette = colors[:5] or ["#FAF6EE", "#5A3E2B", "#B7C4A4"]

    references = []
    for index, icon_id in enumerate(icons[:3] or ["1", "2", "5"]):
        ref = REFERENCE_STYLES.get(icon_id)
        if ref:
            references.append({**ref, "match": max(68, confidence - index * 6)})

    return {
        "image_url": image_url,
        "aesthetic": aesthetic,
        "confidence": confidence,
        "palette": palette,
        "personality": _personality_from_tag(primary_tag),
        "summary": _summary_from_tag(primary_tag),
        "recommendations": _recommendations(primary_tag),
        "references": references,
    }


def _aesthetic_from_tag(tag: str) -> str:
    mapping = {
        "Streetwear": "Clean streetwear",
        "Old money": "Quiet luxury",
        "Coquette": "Soft romantic",
        "Y2K": "Retro pop",
        "Cottagecore": "Natural romantic",
        "Dark academia": "Dark academia",
        "Experimental": "Artful statement",
        "Boho": "Relaxed boho",
        "Athleisure": "Sport casual",
    }
    return mapping.get(tag, "Refined minimal")


def _personality_from_tag(tag: str) -> str:
    if tag in {"Streetwear", "Y2K", "Experimental"}:
        return "Expressive and trend aware"
    if tag in {"Old money", "Minimal", "Dark academia"}:
        return "Composed and detail focused"
    return "Warm and easygoing"


def _summary_from_tag(tag: str) -> str:
    if tag in {"Old money", "Minimal"}:
        return "The look works best when the silhouette stays clean and the palette stays controlled."
    if tag in {"Streetwear", "Y2K", "Experimental"}:
        return "The look can carry a stronger focal point, especially through texture, print, or proportion."
    return "The outfit leans soft and personal, so color harmony and fabric texture matter most."


def _recommendations(tag: str) -> list[dict[str, str]]:
    if tag in {"Streetwear", "Y2K", "Experimental"}:
        return [
            {"title": "One graphic layer", "detail": "Adds a focal point without cluttering the full look."},
            {"title": "Structured outerwear", "detail": "Keeps the silhouette intentional."},
            {"title": "Chunky footwear", "detail": "Balances volume and makes the outfit feel finished."},
            {"title": "Metal or color accent", "detail": "Use one accent so the outfit still reads clearly."},
        ]

    return [
        {"title": "Neutral base layer", "detail": "Keeps the outfit repeatable and easy to pair."},
        {"title": "Tailored trouser", "detail": "Adds structure without feeling formal."},
        {"title": "Textured accessory", "detail": "A belt, bag, or watch can add depth."},
        {"title": "Simple footwear", "detail": "Lets the silhouette and palette stay in focus."},
    ]
