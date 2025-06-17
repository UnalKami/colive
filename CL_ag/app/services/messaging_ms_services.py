import httpx
from app.config import MESSAGING_MS_URL

async def register_token(token_data):
    """
    Register a token in the messaging microservice.
    """
    async with httpx.AsyncClient() as client:
        print(f"Registering token: {token_data}")
        response = await client.post(f"{MESSAGING_MS_URL}/msg/sesion/crear", json=token_data)        
        print(f"Response from messaging microservice: {response}")
        response.raise_for_status()  # Raise an error for bad responses
        print("Para el response.raise_for_status() no se ha producido un error")
        return response  # Return the JSON response from the microservice