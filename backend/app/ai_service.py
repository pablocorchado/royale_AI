from anthropic import Anthropic
from typing import Dict, List
from app.config import settings

class ClaudeAIService:
    def __init__(self):
        self.client = Anthropic(api_key=settings.anthropic_api_key)
        self.model = "claude-sonnet-4-20250514"
    
    async def analyze_battles(self, player_data: Dict, battles: List[Dict]) -> str:
        """
        Analiza las batallas del jugador y genera recomendaciones personalizadas
        """
        player_info = f"""
Jugador: {player_data.get('name', 'Unknown')}
Nivel: {player_data.get('expLevel', 0)}
Trofeos actuales: {player_data.get('trophies', 0)}
Trofeos máximos: {player_data.get('bestTrophies', 0)}
Victorias: {player_data.get('wins', 0)}
Derrotas: {player_data.get('losses', 0)}
"""
        
        recent_battles = battles[:10]
        battles_summary = self._format_battles(recent_battles)
        
        prompt = f"""Eres un coach experto de Clash Royale con años de experiencia. Analiza el siguiente perfil y batallas recientes:

{player_info}

ÚLTIMAS BATALLAS:
{battles_summary}

Proporciona un análisis detallado y personalizado que incluya:

1. **Resumen de Rendimiento**: Win rate, tendencias recientes
2. **Análisis de Mazo**: Fortalezas y debilidades de los mazos usados
3. **Patrones Detectados**: Errores recurrentes o situaciones problemáticas
4. **Recomendaciones Específicas**: 3-5 consejos concretos para mejorar
5. **Matchups Problemáticos**: Contra qué arquetipos tiene dificultades

Sé directo, constructivo y específico. Usa emojis para hacer el análisis más visual."""

        message = self.client.messages.create(
            model=self.model,
            max_tokens=2000,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        
        return message.content[0].text
    
    async def recommend_decks(self, player_data: Dict, cards_analysis: Dict) -> str:
        """
        Recomienda mazos basados en las cartas del jugador y el meta actual
        """
        # Obtener cartas de alto nivel
        high_level_cards = [c for c in cards_analysis.get('sorted_by_level', [])[:20]]
        cards_list = ", ".join([f"{c.get('name')} (Nv.{c.get('level')})" for c in high_level_cards])
        
        prompt = f"""Eres un experto en construcción de mazos de Clash Royale. 

Jugador:
- Nivel: {player_data.get('expLevel', 0)}
- Trofeos: {player_data.get('trophies', 0)}
- Arena: {player_data.get('arena', {}).get('name', 'Unknown')}

TOP 20 CARTAS POR NIVEL:
{cards_list}

Basándote en el meta actual de Clash Royale (Diciembre 2024/Enero 2025) y las cartas de alto nivel del jugador, recomienda:

1. **3 MAZOS COMPETITIVOS** que el jugador pueda usar AHORA (usando sus cartas de más nivel)
2. Para cada mazo incluye:
   - 🎴 Las 8 cartas
   - 💪 Fortalezas
   - ⚠️ Debilidades
   - 🎯 Estilo de juego
   - 📊 Dificultad (Fácil/Media/Difícil)

3. **MAZO OBJETIVO** para subir a largo plazo (aunque tenga cartas de bajo nivel)

Formatea cada mazo de forma clara y visual. Usa emojis."""

        message = self.client.messages.create(
            model=self.model,
            max_tokens=2500,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        
        return message.content[0].text
    
    def _format_battles(self, battles: List[Dict]) -> str:
        """
        Formatea las batallas en un texto legible
        """
        formatted = []
        
        for i, battle in enumerate(battles, 1):
            battle_type = battle.get('type', 'Unknown')
            team = battle.get('team', [{}])[0]
            opponent = battle.get('opponent', [{}])[0]
            
            team_crowns = team.get('crowns', 0)
            opponent_crowns = opponent.get('crowns', 0)
            result = "✅ VICTORIA" if team_crowns > opponent_crowns else "❌ DERROTA"
            
            cards = [card.get('name', 'Unknown') for card in team.get('cards', [])]
            cards_str = ", ".join(cards[:4]) + "..." if len(cards) > 4 else ", ".join(cards)
            
            formatted.append(
                f"Batalla {i}: {result} ({team_crowns}-{opponent_crowns}) | {battle_type}\n"
                f"Mazo: {cards_str}\n"
            )
        
        return "\n".join(formatted)
    
    async def chat_with_coach(self, user_message: str, context: Dict) -> str:
        """
        Chat conversacional con el coach IA
        """
        system_prompt = f"""Eres un coach personal de Clash Royale. El jugador tiene:
- Nivel: {context.get('level', 0)}
- Trofeos: {context.get('trophies', 0)}
- Win rate reciente: {context.get('winrate', 'Unknown')}

Responde de forma amigable, útil y específica a sus preguntas sobre estrategia."""

        message = self.client.messages.create(
            model=self.model,
            max_tokens=1000,
            system=system_prompt,
            messages=[
                {"role": "user", "content": user_message}
            ]
        )
        
        return message.content[0].text

# Instancia global del servicio
ai_service = ClaudeAIService()
