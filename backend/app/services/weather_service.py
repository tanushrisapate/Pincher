import asyncio
import logging
import time
from typing import Any, Dict, Optional, Tuple

import httpx

from app.core.config import settings
from app.schemas.weather import WeatherData

logger = logging.getLogger(__name__)

WEATHER_CACHE_TTL_SECONDS = 5 * 60
GEOCODE_CACHE_TTL_SECONDS = 24 * 60 * 60
MAX_CACHE_ENTRIES = 512

# In-memory caches avoid repeated provider calls while keeping location data out of
# PostgreSQL. Caches are process-local and intentionally expire quickly for weather.
_weather_cache: Dict[Tuple[float, float], Tuple[float, Dict[str, Any]]] = {}
_geocode_cache: Dict[Tuple[float, float], Tuple[float, Dict[str, Optional[str]]]] = {}
_geocode_lock = asyncio.Lock()
_last_geocode_request_at = 0.0

# Open-Meteo's WMO weather interpretation codes.
WMO_CODES = {
    0: ("Clear sky", "☀️"),
    1: ("Mainly clear", "🌤️"),
    2: ("Partly cloudy", "⛅"),
    3: ("Overcast", "☁️"),
    45: ("Foggy", "🌫️"),
    48: ("Depositing rime fog", "🌫️"),
    51: ("Light drizzle", "🌦️"),
    53: ("Moderate drizzle", "🌦️"),
    55: ("Dense drizzle", "🌧️"),
    56: ("Light freezing drizzle", "🌧️"),
    57: ("Dense freezing drizzle", "🌧️"),
    61: ("Slight rain", "🌧️"),
    63: ("Moderate rain", "🌧️"),
    65: ("Heavy rain", "⛈️"),
    66: ("Light freezing rain", "🌧️"),
    67: ("Heavy freezing rain", "⛈️"),
    71: ("Slight snow", "🌨️"),
    73: ("Moderate snow", "❄️"),
    75: ("Heavy snow", "❄️"),
    77: ("Snow grains", "❄️"),
    80: ("Slight rain showers", "🌦️"),
    81: ("Moderate rain showers", "🌧️"),
    82: ("Violent rain showers", "⛈️"),
    85: ("Slight snow showers", "🌨️"),
    86: ("Heavy snow showers", "❄️"),
    95: ("Thunderstorm", "⛈️"),
    96: ("Thunderstorm with slight hail", "⛈️"),
    99: ("Thunderstorm with heavy hail", "⛈️"),
}


class WeatherServiceError(Exception):
    """An upstream weather service failed or returned an invalid response."""


class WeatherLocationNotFound(Exception):
    """A forward-geocoded city could not be resolved."""


def _read_cache(cache: dict, key: tuple, ttl_seconds: int) -> Optional[dict]:
    entry = cache.get(key)
    if not entry:
        return None
    expires_at, value = entry
    if expires_at <= time.monotonic():
        cache.pop(key, None)
        return None
    return dict(value)


def _write_cache(cache: dict, key: tuple, value: dict, ttl_seconds: int) -> None:
    if len(cache) >= MAX_CACHE_ENTRIES and key not in cache:
        cache.pop(next(iter(cache)))
    cache[key] = (time.monotonic() + ttl_seconds, dict(value))


def _coordinate_key(lat: float, lon: float, digits: int) -> Tuple[float, float]:
    return round(lat, digits), round(lon, digits)


def _first_address_value(address: dict, keys: Tuple[str, ...]) -> Optional[str]:
    for key in keys:
        value = address.get(key)
        if isinstance(value, str) and value.strip():
            return value.strip()
    return None


def _location_from_address(address: dict) -> Dict[str, Optional[str]]:
    locality = _first_address_value(
        address,
        ("neighbourhood", "suburb", "city_district", "town", "village", "hamlet", "municipality", "city"),
    )
    city = _first_address_value(
        address,
        ("city", "town", "village", "municipality", "hamlet", "suburb", "city_district", "county"),
    ) or locality
    region = _first_address_value(address, ("state", "province", "region", "state_district", "county"))
    country = _first_address_value(address, ("country",))
    return {
        "city": city,
        "locality": locality,
        "region": region,
        "country": country,
    }


async def _reverse_geocode(lat: float, lon: float) -> Dict[str, Optional[str]]:
    global _last_geocode_request_at

    key = _coordinate_key(lat, lon, 3)
    cached = _read_cache(_geocode_cache, key, GEOCODE_CACHE_TTL_SECONDS)
    if cached is not None:
        return cached

    # The public Nominatim service requires an identifying User-Agent and a
    # maximum request rate of one request per second. Serialize cache misses.
    async with _geocode_lock:
        cached = _read_cache(_geocode_cache, key, GEOCODE_CACHE_TTL_SECONDS)
        if cached is not None:
            return cached

        wait_seconds = 1.0 - (time.monotonic() - _last_geocode_request_at)
        if wait_seconds > 0:
            await asyncio.sleep(wait_seconds)

        try:
            async with httpx.AsyncClient(
                timeout=8.0,
                headers={
                    "User-Agent": "Pincher/1.0 (+https://github.com/tanushrisapate/Pincher)",
                    "Accept-Language": "en",
                },
            ) as client:
                response = await client.get(
                    settings.REVERSE_GEOCODER_URL,
                    params={
                        "format": "jsonv2",
                        "lat": lat,
                        "lon": lon,
                        "addressdetails": 1,
                        "zoom": 14,
                    },
                )
                _last_geocode_request_at = time.monotonic()
                response.raise_for_status()
                payload = response.json()
                location = _location_from_address(payload.get("address") or {})
                _write_cache(_geocode_cache, key, location, GEOCODE_CACHE_TTL_SECONDS)
                return location
        except Exception as exc:
            logger.warning("Reverse geocoding failed: %s", exc)
            # Weather remains useful even if no OSM locality is available.
            location = {"city": None, "locality": None, "region": None, "country": None}
            _write_cache(_geocode_cache, key, location, 10 * 60)
            return location


def _recommendation_summary(temp: float, condition: str, precipitation: float) -> str:
    if temp < 12:
        summary = "Cold weather: Heavy outerwear, layering, and warm boots recommended."
    elif temp < 18:
        summary = "Crisp weather: Light jackets, knitwear, and long trousers recommended."
    elif temp < 26:
        summary = "Mild weather: Breathable layers and comfortable trousers recommended."
    else:
        summary = "Warm weather: Light, breathable fabrics and relaxed fits recommended."

    if precipitation > 0 or any(term in condition.lower() for term in ("rain", "drizzle", "shower", "storm")):
        summary += " Wet conditions: Prefer water-resistant outerwear and closed footwear."
    return summary


async def _fetch_current_conditions(lat: float, lon: float) -> Dict[str, Any]:
    key = _coordinate_key(lat, lon, 2)
    cached = _read_cache(_weather_cache, key, WEATHER_CACHE_TTL_SECONDS)
    if cached is not None:
        return cached

    try:
        async with httpx.AsyncClient(timeout=8.0) as client:
            response = await client.get(
                "https://api.open-meteo.com/v1/forecast",
                params={
                    "latitude": lat,
                    "longitude": lon,
                    "current": "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m",
                    "temperature_unit": "celsius",
                    "wind_speed_unit": "kmh",
                    "timezone": "auto",
                },
            )
            response.raise_for_status()
            payload = response.json()
            current = payload.get("current") or {}
            required = (
                "temperature_2m",
                "relative_humidity_2m",
                "apparent_temperature",
                "weather_code",
                "wind_speed_10m",
            )
            if any(current.get(field) is None for field in required):
                raise WeatherServiceError("Weather provider returned incomplete current conditions.")

            code = int(current["weather_code"])
            condition, icon = WMO_CODES.get(code, ("Unknown conditions", "☁️"))
            temperature = float(current["temperature_2m"])
            precipitation = float(current.get("precipitation") or 0.0)
            values = {
                "temperature": round(temperature, 1),
                "feels_like": round(float(current["apparent_temperature"]), 1),
                "condition": condition,
                "condition_code": code,
                "humidity": int(current["relative_humidity_2m"]),
                "wind_speed": round(float(current["wind_speed_10m"]), 1),
                "precipitation_mm": round(precipitation, 1),
                "rain_probability": None,
                "icon": icon,
                "observed_at": current.get("time"),
                "recommendation_summary": _recommendation_summary(temperature, condition, precipitation),
            }
            _write_cache(_weather_cache, key, values, WEATHER_CACHE_TTL_SECONDS)
            return values
    except WeatherServiceError:
        raise
    except Exception as exc:
        logger.warning("Open-Meteo current weather request failed: %s", exc)
        raise WeatherServiceError("Current weather is temporarily unavailable.") from exc


async def fetch_weather_by_coords(lat: float, lon: float) -> WeatherData:
    """Return current weather and reverse-geocoded location for WGS84 coordinates."""
    conditions, location = await asyncio.gather(
        _fetch_current_conditions(lat, lon),
        _reverse_geocode(lat, lon),
    )
    return WeatherData(
        city=location.get("city"),
        locality=location.get("locality"),
        region=location.get("region"),
        country=location.get("country"),
        latitude=lat,
        longitude=lon,
        **conditions,
    )


async def fetch_weather_by_city(city: str) -> WeatherData:
    """Forward-geocode a city with Open-Meteo, then use the shared coordinate flow."""
    try:
        async with httpx.AsyncClient(timeout=8.0) as client:
            response = await client.get(
                "https://geocoding-api.open-meteo.com/v1/search",
                params={"name": city, "count": 1, "language": "en", "format": "json"},
            )
            response.raise_for_status()
            results = (response.json() or {}).get("results") or []
            if not results:
                raise WeatherLocationNotFound("No matching location was found.")
            result = results[0]
            return await fetch_weather_by_coords(float(result["latitude"]), float(result["longitude"]))
    except WeatherLocationNotFound:
        raise
    except WeatherServiceError:
        raise
    except Exception as exc:
        logger.warning("Open-Meteo city search failed: %s", exc)
        raise WeatherServiceError("Location search is temporarily unavailable.") from exc
