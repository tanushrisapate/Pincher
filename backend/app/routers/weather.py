from fastapi import APIRouter, HTTPException, Query, Response

from app.schemas.weather import WeatherResponse
from app.services.weather_service import (
    WeatherLocationNotFound,
    WeatherServiceError,
    fetch_weather_by_city,
    fetch_weather_by_coords,
)

router = APIRouter(prefix="/api/weather", tags=["Weather"])


@router.get("/current", response_model=WeatherResponse)
async def get_current_weather(
    response: Response,
    lat: float = Query(..., ge=-90, le=90, description="WGS84 latitude"),
    lon: float = Query(..., ge=-180, le=180, description="WGS84 longitude"),
):
    response.headers["Cache-Control"] = "private, no-store"
    try:
        weather_data = await fetch_weather_by_coords(lat, lon)
    except WeatherServiceError as exc:
        raise HTTPException(status_code=502, detail="Current weather is temporarily unavailable.") from exc
    return WeatherResponse(success=True, data=weather_data)


@router.get("/by-city", response_model=WeatherResponse)
async def get_weather_by_city(
    response: Response,
    city: str = Query(..., min_length=1, max_length=120, description="City name to search"),
):
    response.headers["Cache-Control"] = "private, no-store"
    try:
        weather_data = await fetch_weather_by_city(city)
    except WeatherLocationNotFound as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except WeatherServiceError as exc:
        raise HTTPException(status_code=502, detail="Weather lookup is temporarily unavailable.") from exc
    return WeatherResponse(success=True, data=weather_data)
