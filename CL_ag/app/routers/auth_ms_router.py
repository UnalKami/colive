from fastapi import APIRouter, HTTPException, Response, Header
from pydantic import BaseModel
from app.services.auth_ms_services import get_saludo, post_login, verify_token
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
async def login(request: LoginRequest, response: Response):
    try:
        # Llama al microservicio y obtiene la respuesta completa
        ms_response = await post_login(request.username, request.password, return_full_response=True)
        # Reenvía la cookie si existe
        set_cookie = ms_response.headers.get("set-cookie")
        if set_cookie:
            response.headers["set-cookie"] = set_cookie
        return ms_response.json()
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=e.response.text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/verify-token")
async def verify_token_endpoint(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Token no proporcionado")
    
    token = authorization.split(" ")[1]
    try:
        user_data = await verify_token(token)
        return user_data
    except Exception as e:
        raise HTTPException(status_code=401, detail="Token inválido")