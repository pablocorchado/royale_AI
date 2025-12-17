import httpx
from typing import Dict, List, Optional
from app.config import settings
from urllib.parse import quote

class ClashRoyaleService:
    def __init__(self):
        self.base_url = "https://api.clashroyale.com/v1"
        self.headers = {
            "Authorization": f"Bearer {settings.clash_royale_api_key}",
            "Accept": "application/json"
        }
    
    def _format_tag(self, player_tag: str) -> str:
        """Formatea el tag del jugador correctamente"""
        # Quitar el # si existe
        tag = player_tag.replace('#', '').upper()
        # Añadir # y encodear para URL
        return quote(f"#{tag}")
    
    async def get_player(self, player_tag: str) -> Dict:
        """Obtiene información del jugador"""
        encoded_tag = self._format_tag(player_tag)
        
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/players/{encoded_tag}",
                headers=self.headers,
                timeout=10.0
            )
            response.raise_for_status()
            return response.json()
    
    async def get_player_battles(self, player_tag: str) -> List[Dict]:
        """Obtiene batallas recientes del jugador"""
        encoded_tag = self._format_tag(player_tag)
        
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/players/{encoded_tag}/battlelog",
                headers=self.headers,
                timeout=10.0
            )
            response.raise_for_status()
            return response.json()
    
    async def get_player_chests(self, player_tag: str) -> Dict:
        """Obtiene información de cofres"""
        encoded_tag = self._format_tag(player_tag)
        
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/players/{encoded_tag}/upcomingchests",
                headers=self.headers,
                timeout=10.0
            )
            response.raise_for_status()
            return response.json()
    
    def analyze_player_cards(self, player_data: Dict) -> Dict:
        """Analiza las cartas del jugador"""
        cards = player_data.get('cards', [])
        
        # Contadores por rareza
        rarity_counts = {
            'common': {'total': 0, 'maxed': 0, 'avg_level': 0},
            'rare': {'total': 0, 'maxed': 0, 'avg_level': 0},
            'epic': {'total': 0, 'maxed': 0, 'avg_level': 0},
            'legendary': {'total': 0, 'maxed': 0, 'avg_level': 0},
            'champion': {'total': 0, 'maxed': 0, 'avg_level': 0}
        }
        
        max_levels = {
            'common': 15,
            'rare': 13,
            'epic': 11,
            'legendary': 9,
            'champion': 9
        }
        
        sorted_cards = []
        
        for card in cards:
            rarity = card.get('rarity', 'common').lower()
            level = card.get('level', 1)
            
            # Añadir a lista ordenada
            sorted_cards.append({
                'name': card.get('name'),
                'level': level,
                'rarity': rarity,
                'count': card.get('count', 0),
                'max_level': max_levels.get(rarity, 15)
            })
            
            # Contar por rareza
            if rarity in rarity_counts:
                rarity_counts[rarity]['total'] += 1
                if level >= max_levels.get(rarity, 15):
                    rarity_counts[rarity]['maxed'] += 1
        
        # Calcular promedios
        for rarity in rarity_counts:
            rarity_cards = [c for c in sorted_cards if c['rarity'] == rarity]
            if rarity_cards:
                avg = sum(c['level'] for c in rarity_cards) / len(rarity_cards)
                rarity_counts[rarity]['avg_level'] = round(avg, 1)
        
        # Ordenar por nivel (descendente) y luego por nombre
        sorted_cards.sort(key=lambda x: (-x['level'], x['name']))
        
        return {
            'cards': sorted_cards,
            'rarity_stats': rarity_counts,
            'total_cards': len(cards)
        }
    
    def analyze_battle_stats(self, battles: List[Dict]) -> Dict:
        """Analiza estadísticas de batallas"""
        if not battles:
            return {
                'total_battles': 0,
                'wins': 0,
                'losses': 0,
                'win_rate': 0,
                'by_game_mode': {},
                'top_cards': []
            }
        
        total_battles = len(battles)
        wins = 0
        game_modes = {}
        card_usage = {}
        
        for battle in battles:
            battle_type = battle.get('type', 'Unknown')
            
            # Contar wins
            team = battle.get('team', [{}])[0]
            opponent = battle.get('opponent', [{}])[0]
            
            team_crowns = team.get('crowns', 0)
            opponent_crowns = opponent.get('crowns', 0)
            
            is_win = team_crowns > opponent_crowns
            if is_win:
                wins += 1
            
            # Estadísticas por modo
            if battle_type not in game_modes:
                game_modes[battle_type] = {'wins': 0, 'total': 0}
            
            game_modes[battle_type]['total'] += 1
            if is_win:
                game_modes[battle_type]['wins'] += 1
            
            # Contar uso de cartas
            for card in team.get('cards', []):
                card_name = card.get('name', 'Unknown')
                if card_name not in card_usage:
                    card_usage[card_name] = {'used': 0, 'wins': 0}
                
                card_usage[card_name]['used'] += 1
                if is_win:
                    card_usage[card_name]['wins'] += 1
        
        # Top cartas más usadas
        top_cards = []
        for card_name, stats in card_usage.items():
            win_rate = (stats['wins'] / stats['used'] * 100) if stats['used'] > 0 else 0
            top_cards.append({
                'name': card_name,
                'times_used': stats['used'],
                'wins': stats['wins'],
                'win_rate': round(win_rate, 1)
            })
        
        top_cards.sort(key=lambda x: x['times_used'], reverse=True)
        top_cards = top_cards[:8]
        
        # Calcular win rate por modo
        for mode in game_modes:
            total = game_modes[mode]['total']
            game_modes[mode]['win_rate'] = round(
                (game_modes[mode]['wins'] / total * 100) if total > 0 else 0,
                1
            )
        
        return {
            'total_battles': total_battles,
            'wins': wins,
            'losses': total_battles - wins,
            'win_rate': round((wins / total_battles * 100) if total_battles > 0 else 0, 1),
            'by_game_mode': game_modes,
            'top_cards': top_cards
        }

clash_service = ClashRoyaleService()
