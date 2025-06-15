import httpx
from app.config import AUTH_MS_URL

async def get_saludo():
    """
    Fetch a greeting message from the authentication microservice.
    """
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{AUTH_MS_URL}/saludo")        
        response.raise_for_status()  # Raise an error for bad responses
        return response.json()  # Return the JSON response from the microservice

async def register_admin(admin_data):
    """
    Register an admin user in the authentication microservice.
    """
    async with httpx.AsyncClient() as client:
        response = await client.post(f"{AUTH_MS_URL}/api/registro/admin", json=admin_data)        
        response.raise_for_status()  # Raise an error for bad responses
        return response.json()  # Return the JSON response from the microservice