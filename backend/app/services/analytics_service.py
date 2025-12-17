from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from datetime import datetime, timedelta
from typing import Dict, List
from app.models import PlayerSnapshot, Battle, DailyStats

class AnalyticsService:
    """Servicio para calcular métricas y analíticas"""
    
    def get_trophy_history(self, db: Session, user_id: int, days: int = 30) -> List[Dict]:
        """Obtiene historial de trofeos"""
        start_date = datetime.utcnow() - timedelta(days=days)
        
        snapshots = db.query(PlayerSnapshot).filter(
            and_(
                PlayerSnapshot.user_id == user_id,
                PlayerSnapshot.snapshot_date >= start_date
            )
        ).order_by(PlayerSnapshot.snapshot_date).all()
        
        return [
            {
                "date": snap.snapshot_date.isoformat(),
                "trophies": snap.trophies,
                "best_trophies": snap.best_trophies
            }
            for snap in snapshots
        ]
    
    def get_win_rate_history(self, db: Session, user_id: int, days: int = 30) -> List[Dict]:
        """Obtiene historial de win rate"""
        start_date = datetime.utcnow() - timedelta(days=days)
        
        daily_stats = db.query(DailyStats).filter(
            and_(
                DailyStats.user_id == user_id,
                DailyStats.stat_date >= start_date.date()
            )
        ).order_by(DailyStats.stat_date).all()
        
        result = []
        for stat in daily_stats:
            total = stat.wins_today + stat.losses_today
            win_rate = (stat.wins_today / total * 100) if total > 0 else 0
            result.append({
                "date": stat.stat_date.isoformat(),
                "wins": stat.wins_today,
                "losses": stat.losses_today,
                "win_rate": round(win_rate, 1)
            })
        
        return result
    
    def get_battle_distribution(self, db: Session, user_id: int) -> Dict:
        """Obtiene distribución de batallas por tipo"""
        battles = db.query(
            Battle.battle_type,
            func.count(Battle.id).label('count'),
            func.sum(func.cast(Battle.is_win, int)).label('wins')
        ).filter(
            Battle.user_id == user_id
        ).group_by(
            Battle.battle_type
        ).all()
        
        result = {}
        for battle_type, count, wins in battles:
            losses = count - (wins or 0)
            win_rate = (wins / count * 100) if count > 0 else 0
            result[battle_type] = {
                "total": count,
                "wins": wins or 0,
                "losses": losses,
                "win_rate": round(win_rate, 1)
            }
        
        return result
    
    def get_progress_summary(self, db: Session, user_id: int) -> Dict:
        """Obtiene resumen de progreso del usuario"""
        # Último snapshot
        latest = db.query(PlayerSnapshot).filter(
            PlayerSnapshot.user_id == user_id
        ).order_by(PlayerSnapshot.snapshot_date.desc()).first()
        
        # Snapshot de hace 7 días
        week_ago = datetime.utcnow() - timedelta(days=7)
        week_snapshot = db.query(PlayerSnapshot).filter(
            and_(
                PlayerSnapshot.user_id == user_id,
                PlayerSnapshot.snapshot_date <= week_ago
            )
        ).order_by(PlayerSnapshot.snapshot_date.desc()).first()
        
        if not latest:
            return {}
        
        result = {
            "current_trophies": latest.trophies,
            "best_trophies": latest.best_trophies,
            "total_wins": latest.wins,
            "total_losses": latest.losses,
            "level": latest.level,
            "arena": latest.arena_name
        }
        
        if week_snapshot:
            result["trophy_change_7d"] = latest.trophies - week_snapshot.trophies
            result["wins_7d"] = latest.wins - week_snapshot.wins
            result["losses_7d"] = latest.losses - week_snapshot.losses
        
        return result
    
    def compare_players(
        self,
        db: Session,
        user_id_1: int,
        user_id_2: int
    ) -> Dict:
        """Compara dos jugadores"""
        snap1 = db.query(PlayerSnapshot).filter(
            PlayerSnapshot.user_id == user_id_1
        ).order_by(PlayerSnapshot.snapshot_date.desc()).first()
        
        snap2 = db.query(PlayerSnapshot).filter(
            PlayerSnapshot.user_id == user_id_2
        ).order_by(PlayerSnapshot.snapshot_date.desc()).first()
        
        if not snap1 or not snap2:
            return {}
        
        return {
            "player1": {
                "name": snap1.player_name,
                "trophies": snap1.trophies,
                "wins": snap1.wins,
                "losses": snap1.losses,
                "level": snap1.level
            },
            "player2": {
                "name": snap2.player_name,
                "trophies": snap2.trophies,
                "wins": snap2.wins,
                "losses": snap2.losses,
                "level": snap2.level
            },
            "comparison": {
                "trophy_diff": snap1.trophies - snap2.trophies,
                "win_diff": snap1.wins - snap2.wins
            }
        }

analytics_service = AnalyticsService()
