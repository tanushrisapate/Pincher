from fastapi import APIRouter, HTTPException, status, Response, Depends
from app.core.database import get_db_cursor
from app.core.security import hash_password, verify_password, create_access_token, get_current_user
from app.schemas.auth import UserSignup, UserLogin, UserProfile, AuthResponse

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/signup", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def signup(user_data: UserSignup, response: Response):
    # Check if user already exists
    with get_db_cursor() as cur:
        cur.execute("SELECT id FROM users WHERE email = %s", (user_data.email.lower().strip(),))
        existing_user = cur.fetchone()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="An account with this email address already exists."
            )

    # Hash password & insert user
    hashed_pwd = hash_password(user_data.password)
    with get_db_cursor(commit=True) as cur:
        cur.execute(
            """
            INSERT INTO users (name, email, password_hash, persona)
            VALUES (%s, %s, %s, %s)
            RETURNING id, name, email, persona, created_at
            """,
            (
                user_data.name.strip(),
                user_data.email.lower().strip(),
                hashed_pwd,
                user_data.persona or "classic"
            )
        )
        new_user = cur.fetchone()

    # Create JWT Token
    token_payload = {
        "userId": new_user["id"],
        "email": new_user["email"],
        "name": new_user["name"],
        "persona": new_user["persona"]
    }
    token = create_access_token(token_payload)

    # Set httpOnly cookie
    response.set_cookie(
        key="pincher_token",
        value=token,
        httponly=True,
        max_age=60 * 60 * 24 * 7, # 7 days
        samesite="lax",
        secure=False # Set to True in production with HTTPS
    )

    user_profile = UserProfile(
        id=new_user["id"],
        name=new_user["name"],
        email=new_user["email"],
        persona=new_user["persona"],
        created_at=new_user["created_at"]
    )

    return AuthResponse(
        success=True,
        message="Account created successfully.",
        user=user_profile,
        token=token
    )

@router.post("/login", response_model=AuthResponse)
async def login(credentials: UserLogin, response: Response):
    with get_db_cursor() as cur:
        cur.execute(
            "SELECT id, name, email, password_hash, persona, created_at FROM users WHERE email = %s",
            (credentials.email.lower().strip(),)
        )
        user = cur.fetchone()

    if not user or not verify_password(credentials.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )

    token_payload = {
        "userId": user["id"],
        "email": user["email"],
        "name": user["name"],
        "persona": user["persona"]
    }
    token = create_access_token(token_payload)

    response.set_cookie(
        key="pincher_token",
        value=token,
        httponly=True,
        max_age=60 * 60 * 24 * 7,
        samesite="lax",
        secure=False
    )

    user_profile = UserProfile(
        id=user["id"],
        name=user["name"],
        email=user["email"],
        persona=user["persona"],
        created_at=user["created_at"]
    )

    return AuthResponse(
        success=True,
        message="Login successful.",
        user=user_profile,
        token=token
    )

@router.get("/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    with get_db_cursor() as cur:
        cur.execute(
            "SELECT id, name, email, persona, created_at FROM users WHERE id = %s",
            (current_user["userId"],)
        )
        user = cur.fetchone()

    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

    return {
        "success": True,
        "user": UserProfile(
            id=user["id"],
            name=user["name"],
            email=user["email"],
            persona=user["persona"],
            created_at=user["created_at"]
        )
    }

@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie(key="pincher_token")
    return {"success": True, "message": "Logged out successfully."}
