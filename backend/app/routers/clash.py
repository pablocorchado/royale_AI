from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.clash_service import clash_service
from app.services.tracking_service import tracking_service
import logging

router = APIRouter(prefix="/api/clash", tags=["clash"])
logger = logging.getLogger(__name__)

@router.get("/player/{player_tag}/complete")
async def get_complete_profile(
    player_tag: str,
    db: Session = Depends(get_db)
):
    """Obtiene el perfil completo del jugador con análisis"""
    try:
        # Obtener datos del jugador
        player_data = await clash_service.get_player(player_tag)
        
        # Guardar snapshot si corresponde (sin user_id)
        if tracking_service.should_save_snapshot(db, player_data.get('tag')):
            tracking_service.save_player_snapshot(db, player_data, user_id=None)
        
        # Obtener batallas
        battles = await clash_service.get_player_battles(player_tag)
        
        # Análisis de cartas
        cards_analysis = clash_service.analyze_player_cards(player_data)
        
        # Análisis de batallas
        battle_stats = clash_service.analyze_battle_stats(battles)
        
        # Obtener cofres
        try:
            chests = await clash_service.get_player_chests(player_tag)
        except:
            chests = {"items": []}
        
        return {
            "success": True,
            "data": {
                "player": player_data,
                "battles": battles,
                "cards_analysis": cards_analysis,
                "battle_stats": battle_stats,
                "chests": chests
            }
        }
        
    except Exception as e:
        logger.error(f"❌ Error obteniendo perfil: {e}")
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/history/{player_tag}")
async def get_history(
    player_tag: str,
    limit: int = 30,
    db: Session = Depends(get_db)
):
    """Obtiene el historial de snapshots por player_tag (PÚBLICO)"""
    try:
        snapshots = tracking_service.get_player_history_by_tag(db, player_tag, limit)
        
        # Convertir a formato JSON
        history = []
        for snapshot in snapshots:
            history.append({
                "date": snapshot.snapshot_date.isoformat(),
                "player_name": snapshot.player_name,
                "trophies": snapshot.trophies,
                "best_trophies": snapshot.best_trophies,
                "wins": snapshot.wins,
                "losses": snapshot.losses,
                "three_crown_wins": snapshot.three_crown_wins,
                "exp_level": snapshot.exp_level,
                "arena_name": snapshot.arena_name
            })
        
        return {
            "success": True,
            "data": history,
            "count": len(history)
        }
        
    except Exception as e:
        logger.error(f"❌ Error obteniendo historial: {e}")
        raise HTTPException(status_code=500, detail=str(e))

