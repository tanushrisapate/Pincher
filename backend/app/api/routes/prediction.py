import json
import os
import shutil
from uuid import uuid4

from fastapi import APIRouter, Depends, File, Form, UploadFile

from app.core.security import get_current_user
from app.models.user import User
from app.schemas.prediction_schema import PredictionResponse
from app.services.ai_service import build_style_report

router = APIRouter(
    prefix="/predictions",
    tags=["Predictions"],
)


@router.post("/analyze", response_model=PredictionResponse)
def analyze_outfit(
    file: UploadFile = File(...),
    colors: str = Form("[]"),
    icons: str = Form("[]"),
    tags: str = Form("[]"),
    current_user: User = Depends(get_current_user),
):
    os.makedirs("app/uploads/outfits", exist_ok=True)

    extension = os.path.splitext(file.filename or "outfit.jpg")[1] or ".jpg"
    filename = f"{current_user.id}_{uuid4().hex}{extension}"
    filepath = os.path.join("app/uploads/outfits", filename)

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    selected_colors = json.loads(colors)
    selected_icons = json.loads(icons)
    selected_tags = json.loads(tags)

    return build_style_report(
        image_url=f"/uploads/outfits/{filename}",
        colors=selected_colors,
        icons=selected_icons,
        tags=selected_tags,
    )
