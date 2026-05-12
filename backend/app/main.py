from fastapi import FastAPI

from app.api.routes import auth

from app.core.database import (
    Base,
    engine
)

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(auth.router)

@app.get("/")
def home():
    return {
        "message": "Pincher Backend Running Successfully"
    }