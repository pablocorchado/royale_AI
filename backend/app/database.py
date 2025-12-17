from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import NullPool
from app.config import settings
from app.models import Base
from contextlib import contextmanager

# Crear engine de base de datos
engine = create_engine(
    settings.database_url,
    poolclass=NullPool,
    echo=settings.debug
)

# Crear SessionLocal
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    """
    Inicializa la base de datos creando todas las tablas
    """
    Base.metadata.create_all(bind=engine)

def get_db() -> Session:
    """
    Dependency para obtener una sesión de base de datos
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@contextmanager
def get_db_context():
    """
    Context manager para usar la base de datos
    """
    db = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()
