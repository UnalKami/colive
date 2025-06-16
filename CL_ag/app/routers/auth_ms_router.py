from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.auth_ms_services import get_saludo, post_login
import httpx
from httpx import HTTPStatusError


router = APIRouter()

class LoginRequest(BaseModel):
    username: str
    password: str

@router.get("/saludo")
async def saludo():
    return await get_saludo()

@router.post("/login")
async def login(request: LoginRequest):
    try:
        return await post_login(request.username, request.password)
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=e.response.text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
