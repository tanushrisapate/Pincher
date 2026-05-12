from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session

from app.core.database import get_db

from app.schemas.auth_schema import (
    SignupSchema,
    LoginSchema
)

from app.services.auth_service import (
    signup_service,
    login_service
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

@router.post("/signup")
def signup(
    user: SignupSchema,
    db: Session = Depends(get_db)
):
    return signup_service(user, db)

@router.post("/login")
def login(
    user: LoginSchema,
    db: Session = Depends(get_db)
):
    return login_service(user, db)