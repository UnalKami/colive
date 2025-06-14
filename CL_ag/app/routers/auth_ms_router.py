from fastapi import APIRouter
from app.services.auth_ms_services import get_saludo

router = APIRouter()

@router.get("/saludo")
async def saludo():
    response = await get_saludo()
    return response