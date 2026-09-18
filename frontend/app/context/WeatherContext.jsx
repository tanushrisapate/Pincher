"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

const WeatherContext = createContext(null);
const SESSION_KEY = "pincher_weather_session_v1";
const WEATHER_TTL_MS = 10 * 60 * 1000;
const REFRESH_INTERVAL_MS = 10 * 60 * 1000;

let pendingPositionRequest = null;

function readSessionWeather() {
  try {
    const value = sessionStorage.getItem(SESSION_KEY);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

function writeSessionWeather(value) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(value));
  } catch {
    // Storage can be unavailable in private browsing; in-memory state still works.
  }
}

function getBrowserPosition() {
  if (pendingPositionRequest) return pendingPositionRequest;

  pendingPositionRequest = new Promise((resolve, reject) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      reject({ code: 0, message: "Geolocation is not supported by this browser." });
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, (error) => {
      if (error?.code === 2 || error?.code === 3) {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: false,
          timeout: 15_000,
          maximumAge: 60_000,
        });
        return;
      }
      reject(error);
    }, {
      enableHighAccuracy: true,
      timeout: 12_000,
      maximumAge: 5 * 60 * 1000,
    });
  }).finally(() => {
    pendingPositionRequest = null;
  });

  return pendingPositionRequest;
}

function positionMessage(error) {
  if (error?.code === 1) return "Location access is blocked. Allow it in your browser to see local weather.";
  if (error?.code === 0) return "Location is not available in this browser.";
  if (error?.code === 2) return "Location service unavailable. Check Windows Location Services and try again.";
  if (error?.code === 3) return "Location request timed out. Retry when your device can determine its position.";
  return "Your location could not be determined. Try again when location services are available.";
}

function positionStatus(error) {
  if (error?.code === 1) return "denied";
  if (error?.code === 2) return "position-unavailable";
  if (error?.code === 3) return "timeout";
  return "unavailable";
}

export function WeatherProvider({ children }) {
  const [weather, setWeather] = useState(null);
  const [status, setStatus] = useState("loading-location");
  const [message, setMessage] = useState("Finding your location…");
  const [coordinates, setCoordinates] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const mountedRef = useRef(false);
  const locationRequestRef = useRef(false);
  const weatherRequestRef = useRef(null);

  const fetchWeather = useCallback((coords) => {
    const nextCoordinates = {
      latitude: Number(coords.latitude),
      longitude: Number(coords.longitude),
    };
    const requestKey = `${nextCoordinates.latitude},${nextCoordinates.longitude}`;
    if (weatherRequestRef.current?.key === requestKey) {
      return weatherRequestRef.current.promise;
    }

    const request = { key: requestKey, promise: null };
    weatherRequestRef.current = request;
    setCoordinates(nextCoordinates);
    setStatus("loading-weather");
    setMessage("Loading local weather…");
    writeSessionWeather({ status: "loading-weather", coordinates: nextCoordinates, fetchedAt: Date.now() });

    request.promise = (async () => {
      try {
        const params = new URLSearchParams({
          lat: String(nextCoordinates.latitude),
          lon: String(nextCoordinates.longitude),
        });
        const response = await fetch(`/api/weather/current?${params}`, { cache: "no-store" });
        const payload = await response.json().catch(() => null);
        if (!response.ok || !payload?.success || !payload?.data) {
          const error = new Error(payload?.error || "Local weather is temporarily unavailable.");
          error.kind = payload?.code || (response.status === 404 ? "BACKEND_UNAVAILABLE" : "WEATHER_UNAVAILABLE");
          throw error;
        }
        if (!mountedRef.current || weatherRequestRef.current !== request) return null;

        const fetchedAt = Date.now();
        setWeather(payload.data);
        setStatus("ready");
        setMessage("");
        setLastUpdated(fetchedAt);
        writeSessionWeather({
          status: "ready",
          coordinates: nextCoordinates,
          weather: payload.data,
          fetchedAt,
        });
        return payload.data;
      } catch (error) {
        if (!mountedRef.current || weatherRequestRef.current !== request) return null;
        setWeather(null);
        setStatus(error?.kind === "BACKEND_UNAVAILABLE" ? "backend-unavailable" : "weather-unavailable");
        setMessage(error?.message || "Local weather is temporarily unavailable.");
        writeSessionWeather({ status: "error", coordinates: nextCoordinates, fetchedAt: Date.now() });
        return null;
      }
    })().finally(() => {
      if (weatherRequestRef.current === request) weatherRequestRef.current = null;
    });
    return request.promise;
  }, []);

  const requestLocation = useCallback(async ({ force = false } = {}) => {
    if (locationRequestRef.current) return;
    const cached = readSessionWeather();

    if (!force && cached?.coordinates) {
      setCoordinates(cached.coordinates);
      if (cached.status === "ready" && cached.weather && Date.now() - cached.fetchedAt < WEATHER_TTL_MS) {
        setWeather(cached.weather);
        setStatus("ready");
        setMessage("");
        setLastUpdated(cached.fetchedAt);
        return;
      }
      return fetchWeather(cached.coordinates);
    }

    if (!force && cached?.status === "denied") {
      setWeather(null);
      setStatus("denied");
      setMessage(cached.message || "Location access is blocked. Allow it in your browser to see local weather.");
      return;
    }
    if (!force && ["unavailable", "position-unavailable", "timeout"].includes(cached?.status)) {
      setWeather(null);
      setStatus(cached.status);
      setMessage(cached.message || "Location is not available in this browser.");
      return;
    }
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      const unavailableMessage = "Location is not available in this browser.";
      setWeather(null);
      setStatus("unavailable");
      setMessage(unavailableMessage);
      writeSessionWeather({ status: "unavailable", message: unavailableMessage, fetchedAt: Date.now() });
      return;
    }

    locationRequestRef.current = true;
    setWeather(null);
    setStatus("loading-location");
    setMessage("Finding your location…");
    writeSessionWeather({ status: "requesting-location", fetchedAt: Date.now() });

    try {
      const position = await getBrowserPosition();
      const coords = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
      if (mountedRef.current) await fetchWeather(coords);
    } catch (error) {
      const nextStatus = positionStatus(error);
      const nextMessage = positionMessage(error);
      if (mountedRef.current) {
        setWeather(null);
        setStatus(nextStatus);
        setMessage(nextMessage);
        writeSessionWeather({ status: nextStatus, message: nextMessage, fetchedAt: Date.now() });
      }
    } finally {
      locationRequestRef.current = false;
    }
  }, [fetchWeather]);

  const refresh = useCallback(() => {
    if (coordinates) return fetchWeather(coordinates);
    return requestLocation({ force: true });
  }, [coordinates, fetchWeather, requestLocation]);

  useEffect(() => {
    mountedRef.current = true;
    requestLocation();
    return () => {
      mountedRef.current = false;
    };
  }, [requestLocation]);

  useEffect(() => {
    if (!coordinates || status !== "ready") return undefined;

    const refreshIfStale = () => {
      if (document.visibilityState !== "visible") return;
      const cached = readSessionWeather();
      if (!cached?.fetchedAt || Date.now() - cached.fetchedAt >= WEATHER_TTL_MS) {
        fetchWeather(coordinates);
      }
    };

    const intervalId = window.setInterval(refreshIfStale, REFRESH_INTERVAL_MS);
    document.addEventListener("visibilitychange", refreshIfStale);
    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", refreshIfStale);
    };
  }, [coordinates, fetchWeather, status]);

  const value = useMemo(
    () => ({ weather, status, message, coordinates, lastUpdated, refresh }),
    [weather, status, message, coordinates, lastUpdated, refresh]
  );

  return <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>;
}

export function useWeather() {
  const context = useContext(WeatherContext);
  if (!context) throw new Error("useWeather must be used within WeatherProvider");
  return context;
}
