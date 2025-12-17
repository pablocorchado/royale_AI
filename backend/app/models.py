from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, DECIMAL, Date, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    username = Column(String(100), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    player_tag = Column(String(20))
    created_at = Column(DateTime, default=datetime.utcnow)
    last_login = Column(DateTime)
    is_premium = Column(Boolean, default=False)
    premium_expires_at = Column(DateTime)
    
    # Relationships
    snapshots = relationship("PlayerSnapshot", back_populates="user", cascade="all, delete-orphan")
    settings = relationship("UserSettings", back_populates="user", uselist=False, cascade="all, delete-orphan")

class PlayerSnapshot(Base):
    __tablename__ = "player_snapshots"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=True)
    player_tag = Column(String(20), nullable=False, index=True)
    player_name = Column(String(100))
    trophies = Column(Integer, default=0)
    best_trophies = Column(Integer, default=0)
    wins = Column(Integer, default=0)
    losses = Column(Integer, default=0)
    three_crown_wins = Column(Integer, default=0)
    exp_level = Column(Integer, default=1)
    total_donations = Column(Integer, default=0)
    arena_id = Column(Integer)
    arena_name = Column(String(100))
    snapshot_date = Column(DateTime, default=datetime.utcnow)
    
    # Relationship
    user = relationship("User", back_populates="snapshots")

class UserSettings(Base):
    __tablename__ = "user_settings"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), unique=True, nullable=False)
    notifications_enabled = Column(Boolean, default=True)
    email_notifications = Column(Boolean, default=False)
    theme = Column(String(20), default='dark')
    language = Column(String(10), default='es')
    
    # Relationship
    user = relationship("User", back_populates="settings")
