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
        try:
            response = await client.post(
                f"{AUTH_MS_URL}/api/registro/admin",
                json=admin_data,
            )
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            error_msg = f"Error al registrar admin (HTTP {e.response.status_code}): "
            if e.response.status_code == 400:
                try:
                    error_detail = e.response.json().get("detail", "Datos inválidos")
                    error_msg += f"Validación fallida: {error_detail}"
                except:
                    error_msg += "Verifica los campos (celular, correo, etc.)"
                raise ValueError(error_msg) from e
            raise  # Relanza otros errores HTTP (500, 401, etc.)

async def post_login(username: str, password: str, return_full_response=False):
    print(f"Logging in user {username} with password {password}")
    async with httpx.AsyncClient() as client:        
        response = await client.post(
            f"{AUTH_MS_URL}/auth/login",
            json={"username": username, "password": password}
        )
        response.raise_for_status()        
        if return_full_response:
            return response
        return response.json()

async def get_admin_info(cookies):
    """
    Get admin information from the authentication microservice using cookies.
    """
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{AUTH_MS_URL}/auth/admin-info",
            cookies=cookies
        )
        response.raise_for_status()
        return response.json()

async def crear_usuario_por_rol(user_data):
    """
    Crear usuario según su rol específico en el microservicio de autenticación.
    """
    rol = user_data.get('rol')
    
    # Mapear rol a endpoint específico
    endpoint_map = {
        'SEGURIDAD_CR': '/api/registro/seguridad',
        'MANTENIMIENTO_CR': '/api/registro/mantenimiento', 
        'ASEO_CR': '/api/registro/aseo',
        'PROPIEDAD_CR': '/api/registro/propietario'
    }
    
    endpoint = endpoint_map.get(rol)
    if not endpoint:
        raise Exception(f"Rol no válido: {rol}")
    
    # Preparar datos para el microservicio
    payload = {
        "username": user_data["username"],
        "nombre": user_data["nombre"],
        "correo": user_data["correo"],
        "password": user_data["password"],
        "celular": int(user_data["celular"]) if user_data["celular"].isdigit() else 0
    }
    
    async with httpx.AsyncClient() as client:
        print(f"Creando usuario {rol} con datos: {payload}")
        response = await client.post(f"{AUTH_MS_URL}{endpoint}", json=payload)
        response.raise_for_status()
        result = response.json()
        
        return {
            "success": True,
            "message": f"Usuario {rol} creado exitosamente",
            "user": {
                "id": result.get("usuarioId"),
                "username": user_data["username"],
                "nombre": user_data["nombre"],
                "rol": rol
            }
        }

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

async def asociar_usuario_conjunto(usuario_id: int, conjunto_residencial_id: int):
    """
    Asociar un usuario con un conjunto residencial en el microservicio de autenticación.
    """
    payload = {
        "usuarioId": usuario_id,
        "conjuntoResidencialId": conjunto_residencial_id
    }
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{AUTH_MS_URL}/api/usuario-conjunto/asociar",
            json=payload
        )
        response.raise_for_status()
        return response.json()
        
async def delete_conjunto_auth(conjunto_id):
    """
    Delete a conjunto in the authentication microservice by conjunto ID.
    """
    async with httpx.AsyncClient() as client:
        response = await client.delete(f"{AUTH_MS_URL}/api/crear/conjunto/{conjunto_id}")
        response.raise_for_status()
        return response.json()
    
async def get_token_rol(rol: int):
    """
    Obtiene un token para un rol específico desde el microservicio de autenticación.
    El microservicio Java espera el parámetro idRol en el body.
    """
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{AUTH_MS_URL}/api/registro/crearQR/{rol}")
        response.raise_for_status()
        return response.json()