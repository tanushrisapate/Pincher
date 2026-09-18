from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any
import bcrypt
import jwt
from fastapi import Request, HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.config import settings
from app.core.database import get_db_cursor

security = HTTPBearer(auto_error=False)
DEMO_USER_EMAIL = "tani@example.com"

def _load_demo_user() -> Dict[str, Any]:
    with get_db_cursor() as cur:
        cur.execute("SELECT id, name, email, persona FROM users ORDER BY id ASC LIMIT 1")
        demo_user = cur.fetchone()

    if not demo_user:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="The demo user could not be initialized.",
        )

    return {
        "userId": demo_user["id"],
        "name": demo_user.get("name", "Tani"),
        "email": demo_user.get("email", DEMO_USER_EMAIL),
        "persona": demo_user.get("persona", "classic"),
    }

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt(rounds=10)
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))
    except Exception:
        return False

def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(days=settings.ACCESS_TOKEN_EXPIRE_DAYS)
    
    to_encode.update({"exp": expire, "iat": datetime.now(timezone.utc)})
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        return payload
    except jwt.PyJWTError:
        return None

async def get_current_user(
    request: Request,
    auth_header: Optional[HTTPAuthorizationCredentials] = Depends(security)
) -> Dict[str, Any]:
    token = None

    # 1. Check Bearer Token header
    if auth_header and auth_header.credentials:
        token = auth_header.credentials
    # 2. Check pincher_token cookie
    elif "pincher_token" in request.cookies:
        token = request.cookies.get("pincher_token")

    if not token:
        # The prototype has one shared local user and intentionally does not
        # require a login session. Reuse existing local data when available.
        return _load_demo_user()

    payload = decode_access_token(token)
    if not payload or "userId" not in payload:
        return _load_demo_user()

    return payload
