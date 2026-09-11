from typing import Optional
from fastapi import APIRouter, Query
from app.schemas.weather import WeatherResponse
from app.services.weather_service import fetch_weather_by_coords, fetch_weather_by_city

router = APIRouter(prefix="/api/weather", tags=["Weather"])

@router.get("/current", response_model=WeatherResponse)
async def get_current_weather(
    lat: float = Query(28.6139, description="Latitude"),
    lon: float = Query(77.2090, description="Longitude"),
    city: Optional[str] = Query("Current Location", description="City display name")
):
    weather_data = await fetch_weather_by_coords(lat, lon, city)
    return WeatherResponse(success=True, data=weather_data)

@router.get("/by-city", response_model=WeatherResponse)
async def get_weather_by_city(
    city: str = Query(..., min_length=1, description="City name to search")
):
    weather_data = await fetch_weather_by_city(city)
    return WeatherResponse(success=True, data=weather_data)
