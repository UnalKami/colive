from fastapi import APIRouter, HTTPException, Response, Request
from pydantic import BaseModel
from app.services.auth_ms_services import get_saludo, post_login, get_admin_info
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

@router.get("/admin-info")
async def obtener_admin_info(request: Request):
    try:
        return await get_admin_info(request.cookies)
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=e.response.text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))