from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from typing import Optional

from app.database import get_db
from app.models import User, UserSettings
from app.auth import (
    authenticate_user,
    create_access_token,
    create_refresh_token,
    get_password_hash,
    get_current_active_user
)
from app.config import settings

router = APIRouter(prefix="/api/auth", tags=["auth"])

# Schemas
class UserRegister(BaseModel):
    email: EmailStr
    username: str
    password: str
    player_tag: Optional[str] = None

class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    player_tag: Optional[str]
    is_premium: bool

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserResponse

@router.post("/register", response_model=Token)
async def register(user_data: UserRegister, db: Session = Depends(get_db)):
    """Registrar nuevo usuario"""
    if db.query(User).filter(User.email == user_data.email).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    if db.query(User).filter(User.username == user_data.username).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken"
        )
    
    hashed_password = get_password_hash(user_data.password)
    new_user = User(
        email=user_data.email,
        username=user_data.username,
        password_hash=hashed_password,
        player_tag=user_data.player_tag
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    user_settings = UserSettings(user_id=new_user.id)
    db.add(user_settings)
    db.commit()
    
    # FIX: Convertir a int explícitamente
    access_token = create_access_token(data={"sub": int(new_user.id)})
    refresh_token = create_refresh_token(data={"sub": int(new_user.id)})
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": {
            "id": new_user.id,
            "email": new_user.email,
            "username": new_user.username,
            "player_tag": new_user.player_tag,
            "is_premium": new_user.is_premium
        }
    }

@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """Login de usuario"""
    user = authenticate_user(db, form_data.username, form_data.password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # FIX: Convertir a int explícitamente
    access_token = create_access_token(data={"sub": int(user.id)})
    refresh_token = create_refresh_token(data={"sub": int(user.id)})
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "username": user.username,
            "player_tag": user.player_tag,
            "is_premium": user.is_premium
        }
    }

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_active_user)):
    """Obtener usuario actual"""
    return {
        "id": current_user.id,
        "email": current_user.email,
        "username": current_user.username,
        "player_tag": current_user.player_tag,
        "is_premium": current_user.is_premium
    }
