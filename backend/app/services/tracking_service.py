from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import and_, func
from app.models import PlayerSnapshot, User
import logging

logger = logging.getLogger(__name__)

class TrackingService:
    """Servicio para tracking histórico de jugadores"""
    
    @staticmethod
    def save_player_snapshot(db: Session, player_data: dict, user_id: int = None) -> PlayerSnapshot:
        """
        Guarda un snapshot del estado actual del jugador
        Ahora funciona con o sin user_id
        """
        try:
            snapshot = PlayerSnapshot(
                user_id=user_id,  # Puede ser None
                player_tag=player_data.get('tag'),
                player_name=player_data.get('name'),
                trophies=player_data.get('trophies', 0),
                best_trophies=player_data.get('bestTrophies', 0),
                wins=player_data.get('wins', 0),
                losses=player_data.get('losses', 0),
                three_crown_wins=player_data.get('threeCrownWins', 0),
                exp_level=player_data.get('expLevel', 1),
                total_donations=player_data.get('totalDonations', 0),
                arena_id=player_data.get('arena', {}).get('id'),
                arena_name=player_data.get('arena', {}).get('name')
            )
            
            db.add(snapshot)
            db.commit()
            db.refresh(snapshot)
            
            logger.info(f"✅ Snapshot guardado para {player_data.get('name')} (tag: {player_data.get('tag')})")
            return snapshot
            
        except Exception as e:
            logger.error(f"❌ Error guardando snapshot: {e}")
            db.rollback()
            raise
    
    @staticmethod
    def get_player_history_by_tag(
        db: Session, 
        player_tag: str, 
        limit: int = 30
    ) -> list[PlayerSnapshot]:
        """
        Obtiene el historial de snapshots por player_tag (sin necesidad de user_id)
        """
        try:
            # Limpiar el tag - siempre asegurar que tenga #
            clean_tag = player_tag.upper()
            if not clean_tag.startswith('#'):
                clean_tag = f'#{clean_tag}'
            
            logger.info(f"🔍 Buscando historial para tag: '{clean_tag}'")
            
            snapshots = db.query(PlayerSnapshot)\
                .filter(PlayerSnapshot.player_tag == clean_tag)\
                .order_by(PlayerSnapshot.snapshot_date.desc())\
                .limit(limit)\
                .all()
            
            logger.info(f"📊 Snapshots encontrados: {len(snapshots)}")
            
            # Invertir para tener del más antiguo al más reciente
            return list(reversed(snapshots))
            
        except Exception as e:
            logger.error(f"❌ Error obteniendo historial: {e}")
            return []
    
    @staticmethod
    def should_save_snapshot(db: Session, player_tag: str) -> bool:
        """
        Determina si se debe guardar un nuevo snapshot basándose en el player_tag
        Política: Un snapshot cada hora (para testing)
        """
        try:
            # Limpiar el tag
            clean_tag = player_tag.upper()
            if not clean_tag.startswith('#'):
                clean_tag = f'#{clean_tag}'
            
            # Obtener último snapshot de este player_tag
            last_snapshot = db.query(PlayerSnapshot)\
                .filter(PlayerSnapshot.player_tag == clean_tag)\
                .order_by(PlayerSnapshot.snapshot_date.desc())\
                .first()
            
            if not last_snapshot:
                logger.info(f"📊 Primer snapshot para {clean_tag}")
                return True
            
            # Verificar si han pasado más de 1 hora
            hours_since_last = (datetime.utcnow() - last_snapshot.snapshot_date).total_seconds() / 3600
            
            if hours_since_last >= 1:
                logger.info(f"⏰ Han pasado {hours_since_last:.1f} horas desde último snapshot")
                return True
            else:
                logger.info(f"⏭️  Snapshot reciente ({hours_since_last:.1f}h) - omitiendo")
                return False
            
        except Exception as e:
            logger.error(f"❌ Error verificando snapshot: {e}")
            return False

tracking_service = TrackingService()