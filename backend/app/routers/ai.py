from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict
from app.ai_service import ai_service

router = APIRouter(prefix="/api/ai", tags=["ai"])

class ChatRequest(BaseModel):
    message: str
    player_context: Dict

@router.post("/chat")
async def chat_with_coach(request: ChatRequest) -> Dict:
    """
    Chat conversacional con el coach IA
    """
    try:
        response = await ai_service.chat_with_coach(
            request.message,
            request.player_context
        )
        
        return {
            "success": True,
            "response": response
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error en chat: {str(e)}")
