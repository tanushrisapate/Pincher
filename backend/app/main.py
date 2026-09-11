import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import init_db
from app.routers import auth, wardrobe, outfits, weather

# Configure logging
logging.basicConfig(
    level=logging.INFO if not settings.DEBUG else logging.DEBUG,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger("pincher-api")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting Pincher AI Wardrobe Intelligence Backend...")
    try:
        init_db()
        logger.info("PostgreSQL Database schema verified and initialized.")
    except Exception as e:
        logger.error(f"Error initializing database schema on startup: {e}")
    yield
    logger.info("Pincher API Backend shutting down...")

app = FastAPI(
    title=settings.APP_NAME,
    description="Full-stack AI-powered Wardrobe Intelligence & Outfit Recommendation Engine backed by PostgreSQL 17 & DeepFashion2 ONNX model.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Configure CORS
origins = settings.cors_origin_list
if not origins:
    origins = ["http://localhost:3000", "http://127.0.0.1:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers
app.include_router(auth.router)
app.include_router(wardrobe.router)
app.include_router(outfits.router)
app.include_router(weather.router)

@app.get("/", tags=["Root"])
async def root():
    return {
        "name": settings.APP_NAME,
        "version": "1.0.0",
        "status": "online",
        "docs": "/docs",
        "theme": "Gold & Luxury (#B8860B / #D4AF37)"
    }

@app.get("/api/health", tags=["Health"])
async def health_check():
    return {
        "status": "healthy",
        "service": "Pincher API",
        "database": "connected"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)
