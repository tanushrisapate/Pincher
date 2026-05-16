import os
import shutil

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user, hash_password, verify_password
from app.models.user import User
from app.schemas.user_schema import ChangePasswordSchema, UpdateUserSchema, UserResponse

router = APIRouter(
    prefix="/users",
    tags=["Users"],
)


@router.get("/me", response_model=UserResponse)
def get_me(
    current_user: User = Depends(get_current_user),
):
    return current_user


@router.put("/me", response_model=UserResponse)
def update_profile(
    data: UpdateUserSchema,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if data.username is not None:
        username = data.username.strip()

        if not username:
            raise HTTPException(
                status_code=400,
                detail="Username cannot be empty",
            )

        existing_user = (
            db.query(User)
            .filter(User.username == username)
            .first()
        )

        if existing_user and existing_user.id != current_user.id:
            raise HTTPException(
                status_code=400,
                detail="Username already taken",
            )

        current_user.username = username

    if data.bio is not None:
        current_user.bio = data.bio

    db.commit()
    db.refresh(current_user)

    return current_user


@router.post("/avatar")
def upload_avatar(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    os.makedirs(
        "app/uploads/avatars",
        exist_ok=True,
    )

    filename = f"{current_user.id}_{file.filename}"
    filepath = f"app/uploads/avatars/{filename}"

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    current_user.avatar = f"/uploads/avatars/{filename}"
    db.commit()

    return {
        "message": "Avatar uploaded successfully",
        "avatar": current_user.avatar,
    }


@router.post("/change-password")
def change_password(
    data: ChangePasswordSchema,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    valid_password = verify_password(
        data.old_password,
        current_user.hashed_password,
    )

    if not valid_password:
        raise HTTPException(
            status_code=400,
            detail="Old password is incorrect",
        )

    current_user.hashed_password = hash_password(data.new_password)
    db.commit()

    return {"message": "Password updated successfully"}
