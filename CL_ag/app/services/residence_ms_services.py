import httpx
from app.config import RESIDENCE_MS_URL

async def registrar_conjunto():
    """
    Register a conjunto in the residence microservice.
    """
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{RESIDENCE_MS_URL}/graphql")        
        response.raise_for_status()  # Raise an error for bad responses
        return response.json()  # Return the JSON response from the microservice