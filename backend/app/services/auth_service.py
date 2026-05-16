from sqlalchemy.orm import Session

from fastapi import HTTPException

from app.models.user import User

from app.schemas.auth_schema import (
    SignupSchema,
    LoginSchema,
)

from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
)


def signup_service(
    user: SignupSchema,
    db: Session,
):
    existing_user = (
        db.query(User)
        .filter(User.email == user.email)
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already exists",
        )

    new_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hash_password(
            user.password
        ),
    )

    db.add(new_user)

    db.commit()

    db.refresh(new_user)

    access_token = create_access_token(
        data={
            "sub": str(new_user.id)
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }


def login_service(
    user: LoginSchema,
    db: Session,
):
    db_user = (
        db.query(User)
        .filter(User.email == user.email)
        .first()
    )

    if not db_user:
        raise HTTPException(
            status_code=400,
            detail="Invalid email",
        )

    valid_password = verify_password(
        user.password,
        db_user.hashed_password,
    )

    if not valid_password:
        raise HTTPException(
            status_code=400,
            detail="Invalid password",
        )

    access_token = create_access_token(
        data={
            "sub": str(db_user.id)
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }