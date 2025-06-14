import httpx
from app.config import AUTH_MS_URL

async def get_saludo():
    """
    Fetch a greeting message from the authentication microservice.
    """
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{AUTH_MS_URL}/saludo")
        print(f"Response from auth microservice: {response}")  # Debugging output
        response.raise_for_status()  # Raise an error for bad responses
        return response.json()  # Return the JSON response from the microservice