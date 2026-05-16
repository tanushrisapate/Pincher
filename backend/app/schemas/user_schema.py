from pydantic import BaseModel
from typing import Optional


class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    bio: Optional[str] = None
    avatar: Optional[str] = ""

    class Config:
        from_attributes = True


class UpdateUserSchema(BaseModel):
    username: Optional[str] = None
    bio: Optional[str] = None


class ChangePasswordSchema(BaseModel):
    old_password: str
    new_password: str
