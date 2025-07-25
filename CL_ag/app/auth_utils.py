import jwt
from fastapi import HTTPException, Request
from typing import Optional

PUBLIC_KEY_PATH = '/run/secrets/JWT_public.key.pub'

with open(PUBLIC_KEY_PATH, 'r') as f:
    PUBLIC_KEY = f.read()

def decode_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, PUBLIC_KEY, algorithms=["RS256"])
        return payload
    except jwt.InvalidTokenError as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")

def get_user_from_request(request: Request) -> dict:
    token = request.cookies.get('authToken')
    if not token:
        raise HTTPException(status_code=401, detail="Token de autenticación requerido")
    
    return decode_token(token)