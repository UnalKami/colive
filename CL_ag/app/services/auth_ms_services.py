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
        print(f"Registering admin in auth with data: {admin_data}")
        response = await client.post(f"{AUTH_MS_URL}/api/registro/admin", json=admin_data)        
        response.raise_for_status()  # Raise an error for bad responses
        return response.json()  # Return the JSON response from the microservice

async def post_login(username: str, password: str):
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{AUTH_MS_URL}/auth/login",
            json={"username": username, "password": password}
        )
        response.raise_for_status()
        return response.json()

async def delete_user(user_id):
    """
    Delete a user in the authentication microservice by user ID.
    """
    async with httpx.AsyncClient() as client:
        response = await client.delete(f"{AUTH_MS_URL}/api/registro/usuario/{user_id}")
        response.raise_for_status()
        return response.json()

async def register_conjunto_auth(conjunto_data):
    """
    Register a residential complex in the authentication microservice.
    """
    print(f"Registering conjunto in auth with data: {conjunto_data}")
    async with httpx.AsyncClient() as client:
        response = await client.post(f"{AUTH_MS_URL}/api/crear/conjunto", json=conjunto_data)
        print(f"Response from auth ms in gateway: {response}")
        response.raise_for_status()  # Raise an error for bad responses
        return response  # Return the JSON response from the microservice