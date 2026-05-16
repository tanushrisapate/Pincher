from pydantic import BaseModel


class Recommendation(BaseModel):
    title: str
    detail: str


class StyleReference(BaseModel):
    name: str
    style: str
    match: int
    img: str | None = None


class PredictionResponse(BaseModel):
    image_url: str
    aesthetic: str
    confidence: int
    palette: list[str]
    personality: str
    summary: str
    recommendations: list[Recommendation]
    references: list[StyleReference]
