from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api.routes.auth import router as auth_router
from app.api.routes.prediction import router as prediction_router
from app.api.routes.users import router as users_router
from app.core.database import Base, engine
from app.models import prediction, uploads  # noqa: F401

app = FastAPI(title="Pincher API")

Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
        "http://127.0.0.1:8080",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(users_router)
app.include_router(prediction_router)

app.mount(
    "/uploads",
    StaticFiles(directory="app/uploads"),
    name="uploads",
)


@app.get("/")
def home():
    return {"message": "Pincher API is running"}
