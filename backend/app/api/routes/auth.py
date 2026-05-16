from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.auth_schema import LoginSchema, SignupSchema
from app.services.auth_service import login_service, signup_service

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post("/signup")
def signup(
    user: SignupSchema,
    db: Session = Depends(get_db),
):
    response = signup_service(user, db)

    return {
        "success": True,
        "message": "User created successfully",
        "data": response,
    }


@router.post("/login")
def login(
    user: LoginSchema,
    db: Session = Depends(get_db),
):
    response = login_service(user, db)

    return {
        "success": True,
        "message": "Login successful",
        "data": response,
    }
