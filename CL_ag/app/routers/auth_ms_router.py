from fastapi import APIRouter, HTTPException, Response
from pydantic import BaseModel
from app.services.auth_ms_services import get_saludo, post_login
from app.services.messaging_ms_services import register_token
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
            token_value = set_cookie.split(";", 1)[0].split("=", 1)[1]
            response.headers["set-cookie"] = set_cookie
            #Register token in messaging microservice        
            print(f"Registrando token: {token_value}")
            messaging_response = await register_token({ "token": token_value })
            print(f"Respuesta del microservicio de mensajería: {messaging_response}")
            print("Token registrado correctamente en el microservicio de mensajería.")
        return ms_response.json()
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=e.response.text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))