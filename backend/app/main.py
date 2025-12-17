from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import init_db
from app.routers import auth
# Importar routers existentes
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

# Importar desde proyecto anterior si existen
try:
    from app.routers import clash, ai
    has_old_routers = True
except:
    has_old_routers = False

# Crear aplicación FastAPI
app = FastAPI(
    title="Clash Royale AI Coach V3",
    description="API completa con autenticación, analytics, tracking y más",
    version="3.0.0"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inicializar base de datos al arrancar
@app.on_event("startup")
async def startup_event():
    init_db()
    print("✅ Database initialized")

# Registrar routers
app.include_router(auth.router)

if has_old_routers:
    app.include_router(clash.router)
    app.include_router(ai.router)

@app.get("/")
async def root():
    return {
        "message": "Clash Royale AI Coach API V3.0",
        "version": "3.0.0",
        "docs": "/docs",
        "features": [
            "Authentication (JWT)",
            "Player Tracking",
            "Analytics & Charts",
            "AI Analysis",
            "Clan Management",
            "Chat with AI Coach"
        ]
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "version": "3.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
