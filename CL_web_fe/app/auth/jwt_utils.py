import jwt
from jwt import InvalidTokenError

PUBLIC_KEY_PATH = '/run/secrets/JWT_public.key.pub'

with open(PUBLIC_KEY_PATH, 'r') as f:
    PUBLIC_KEY = f.read()

def decode_token(token):
    try:
        payload = jwt.decode(token, PUBLIC_KEY, algorithms=["RS256"])
        return payload
    except InvalidTokenError as e:
        raise ValueError(f"Invalid token: {str(e)}")