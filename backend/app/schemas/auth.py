from typing import Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field

class UserSignup(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6)
    persona: Optional[str] = "classic"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserProfile(BaseModel):
    id: int
    name: str
    email: str
    persona: Optional[str] = "classic"
    created_at: Optional[datetime] = None

class AuthResponse(BaseModel):
    success: bool
    message: str
    user: UserProfile
    token: str
