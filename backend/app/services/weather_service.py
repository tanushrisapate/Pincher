import logging
import httpx
from typing import Optional
from app.schemas.weather import WeatherData

logger = logging.getLogger(__name__)

# Weather WMO code mapping
WMO_CODES = {
    0: ("Clear sky", "☀️", 0),
    1: ("Mainly clear", "🌤️", 5),
    2: ("Partly cloudy", "⛅", 10),
    3: ("Overcast", "☁️", 20),
    45: ("Foggy", "🌫️", 15),
    48: ("Depositing rime fog", "🌫️", 20),
    51: ("Light drizzle", "🌦️", 50),
    53: ("Moderate drizzle", "🌦️", 65),
    55: ("Dense drizzle", "🌧️", 80),
    61: ("Slight rain", "🌧️", 60),
    63: ("Moderate rain", "🌧️", 85),
    65: ("Heavy rain", "⛈️", 95),
    71: ("Slight snow", "🌨️", 70),
    73: ("Moderate snow", "❄️", 85),
    75: ("Heavy snow", "❄️", 95),
    80: ("Rain showers", "🌦️", 75),
    95: ("Thunderstorm", "⚡", 90),
}

async def fetch_weather_by_coords(lat: float, lon: float, city_name: Optional[str] = "Current Location") -> WeatherData:
    url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m"
    
    async with httpx.AsyncClient(timeout=6.0) as client:
        try:
            resp = await client.get(url)
            resp.raise_for_status()
            data = resp.json()
            
            curr = data.get("current", {})
            temp = float(curr.get("temperature_2m", 22.0))
            feels_like = float(curr.get("apparent_temperature", temp))
            humidity = int(curr.get("relative_humidity_2m", 50))
            wind = float(curr.get("wind_speed_10m", 5.0))
            code = int(curr.get("weather_code", 0))
            
            condition_info = WMO_CODES.get(code, ("Pleasant", "✨", 10))
            condition_text, icon, rain_prob = condition_info
            
            # Formulate clothing advice
            if temp < 12:
                advice = "Cold weather: Heavy outerwear, layering, and warm boots recommended."
            elif temp < 18:
                advice = "Crisp weather: Light jackets, knitwear, and long trousers recommended."
            elif temp < 26:
                advice = "Pleasant weather: Breathable cottons, tees, shirts, and casual chinos."
            else:
                advice = "Warm & sunny: Light breathable fabrics, short sleeves, and relaxed fits."
                
            if rain_prob > 60:
                advice += " High chance of rain: Prefer water-resistant jacket and closed footwear."

            return WeatherData(
                city=city_name or "Current Location",
                temperature=round(temp, 1),
                feels_like=round(feels_like, 1),
                condition=condition_text,
                condition_code=code,
                humidity=humidity,
                wind_speed=round(wind, 1),
                rain_probability=rain_prob,
                icon=icon,
                recommendation_summary=advice
            )
        except Exception as e:
            logger.warning(f"Failed to fetch live weather: {e}. Using standard default.")
            return WeatherData(
                city=city_name or "Current Location",
                temperature=22.5,
                feels_like=23.0,
                condition="Clear sky",
                condition_code=0,
                humidity=45,
                wind_speed=6.0,
                rain_probability=0,
                icon="☀️",
                recommendation_summary="Pleasant weather: Breathable cottons, tees, shirts, and casual chinos."
            )

async def fetch_weather_by_city(city: str) -> WeatherData:
    """Geocode city and fetch weather data."""
    try:
        geo_url = f"https://geocoding-api.open-meteo.com/v1/search?name={city}&count=1&language=en&format=json"
        async with httpx.AsyncClient(timeout=6.0) as client:
            geo_resp = await client.get(geo_url)
            geo_resp.raise_for_status()
            geo_data = geo_resp.json()
            
            if geo_data.get("results") and len(geo_data["results"]) > 0:
                top_result = geo_data["results"][0]
                lat = top_result["latitude"]
                lon = top_result["longitude"]
                resolved_name = f"{top_result.get('name', city)}, {top_result.get('country_code', '')}".strip(", ")
                return await fetch_weather_by_coords(lat, lon, resolved_name)
    except Exception as e:
        logger.warning(f"Geocoding error for {city}: {e}")
        
    return await fetch_weather_by_coords(28.6139, 77.2090, city)
