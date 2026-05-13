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
    print("Singup API called")

    response = signup_service(user,db)

    print("user created successfully")
    print("user creatted")
    return {
        "success": True,
        "message": "User created successfully",
        "data": response
    }   

@router.post("/login")
def login(
    user: LoginSchema,
    db: Session = Depends(get_db)
):
    print("Login API called")

    response = login_service(user, db)

    return {
        "success": True,
        "message": "Login successful",
        "data": response
    }