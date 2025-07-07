import httpx
from app.config import RESIDENCE_MS_URL, AUTH_MS_URL

async def register_conjunto(conjunto_data):
    """
    Register a conjunto in the residence microservice.
    """
    async with httpx.AsyncClient() as client:
        print(f"Registering conjunto with data: {conjunto_data}")
        response = await client.post(f"{RESIDENCE_MS_URL}/graphql", json=conjunto_data)        
        response.raise_for_status()  # Raise an error for bad responses
        return response.json()  # Return the JSON response from the microservice

async def delete_conjunto(hash_conjunto):
    """
    Deletes a conjunto from the residence microservice.
    """
    async with httpx.AsyncClient() as client:
        response = await client.post(f"{RESIDENCE_MS_URL}/graphql/{hash_conjunto}")        
        response.raise_for_status()  # Raise an error for bad responses
        return response.json()  # Return the JSON response from the microservice

async def crear_residence_con_admin(residence_data, cookies):
    """
    Crear residence obteniendo el nombre del admin desde la cookie.
    """
    try:
        print(f"[DEBUG] Iniciando crear_residence_con_admin con datos: {residence_data}")
        print(f"[DEBUG] Cookies recibidas: {cookies}")
        
        # 1. Obtener información del admin desde el microservicio de auth
        async with httpx.AsyncClient() as client:
            print(f"[DEBUG] Consultando admin info en: {AUTH_MS_URL}/auth/admin-info")
            auth_response = await client.get(
                f"{AUTH_MS_URL}/auth/admin-info",
                cookies=cookies
            )
            auth_response.raise_for_status()
            admin_info = auth_response.json()
            print(f"[DEBUG] Admin info obtenida: {admin_info}")
            
            # 2. Agregar nombreAdmin a los datos de residence
            residence_payload = {
                "nombreAdmin": admin_info["nombreAdmin"],
                "code": residence_data["code"],
                "parqueadero": residence_data.get("parqueadero"),
                "bodega": residence_data.get("bodega")
            }
            print(f"[DEBUG] Payload para residence: {residence_payload}")
            
            # 3. Crear residence en el microservicio
            print(f"[DEBUG] Enviando a: {RESIDENCE_MS_URL}/api/residences/crear")
            residence_response = await client.post(
                f"{RESIDENCE_MS_URL}/api/residences/crear",
                json=residence_payload
            )
            print(f"[DEBUG] Respuesta del microservicio: {residence_response.status_code}")
            residence_response.raise_for_status()
            
            result = residence_response.json()
            print(f"[DEBUG] Resultado final: {result}")
            return result
            
    except httpx.HTTPStatusError as e:
        print(f"[ERROR] HTTP Error: {e.response.status_code} - {e.response.text}")
        raise e
    except Exception as e:
        print(f"[ERROR] Error general: {str(e)}")
        raise Exception(f"Error al crear residence: {str(e)}")

async def crear_usuario_propiedad_con_admin(data, cookies):
    """
    Crear usuario propietario y propiedad asociada obteniendo el nombre del admin desde la cookie.
    """
    try:
        print(f"[DEBUG] Iniciando crear_usuario_propiedad_con_admin con datos: {data}")
        
        # 1. Obtener información del admin desde el microservicio de auth
        async with httpx.AsyncClient() as client:
            auth_response = await client.get(
                f"{AUTH_MS_URL}/auth/admin-info",
                cookies=cookies
            )
            auth_response.raise_for_status()
            admin_info = auth_response.json()
            print(f"[DEBUG] Admin info obtenida: {admin_info}")
            
            # 2. Crear usuario PROPIETARIO en el microservicio de auth
            user_payload = {
                "username": data["user"]["username"],
                "nombre": data["user"]["nombre"],
                "correo": data["user"]["correo"],
                "password": data["user"]["password"],
                "celular": int(data["user"]["celular"]) if data["user"]["celular"].isdigit() else 0
            }
            print(f"[DEBUG] Creando usuario propietario: {user_payload}")
            
            # ✅ CAMBIO: Usar endpoint de propietario en lugar de residente
            user_response = await client.post(
                f"{AUTH_MS_URL}/api/registro/propietario",
                json=user_payload
            )
            user_response.raise_for_status()
            user_result = user_response.json()
            user_id = user_result.get("usuarioId")
            print(f"[DEBUG] Usuario propietario creado con ID: {user_id}")
            
            # 3. Crear residence asociada CON EL USER ID
            residence_payload = {
                "nombreAdmin": admin_info["nombreAdmin"],
                "code": data["residence"]["code"],
                "parqueadero": data["residence"].get("parqueadero"),
                "bodega": data["residence"].get("bodega"),
                "userId": user_id  # ✅ RELACIÓN AGREGADA
            }
            print(f"[DEBUG] Creando residence con userId: {residence_payload}")
            
            residence_response = await client.post(
                f"{RESIDENCE_MS_URL}/api/residences/crear",
                json=residence_payload
            )
            residence_response.raise_for_status()
            residence_result = residence_response.json()
            print(f"[DEBUG] Residence creada: {residence_result}")
            
            # 4. Retornar ambos resultados
            return {
                "success": True,
                "message": "Usuario propietario y propiedad creados y relacionados exitosamente",
                "user": {
                    "id": user_id,
                    "username": data["user"]["username"],
                    "nombre": data["user"]["nombre"],
                    "rol": "PROPIEDAD_CR"
                },
                "residence": {
                    "id": residence_result["data"]["_id"],
                    "code": residence_result["data"]["code"],
                    "userId": user_id  # ✅ CONFIRMACIÓN DE RELACIÓN
                }
            }
            
    except httpx.HTTPStatusError as e:
        print(f"[ERROR] HTTP Error: {e.response.status_code} - {e.response.text}")
        raise Exception(f"Error HTTP {e.response.status_code}: {e.response.text}")
    except Exception as e:
        print(f"[ERROR] Error general: {str(e)}")
        raise Exception(f"Error al crear usuario y propiedad: {str(e)}")

async def crear_reserva(reserva_data):
    mutation = '''
    mutation CrearReserva($reserva: ReservaInput!) {
      crearReserva(reserva: $reserva) {
        id
        estado
      }
    }
    '''
    variables = {"reserva": reserva_data}
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{RESIDENCE_MS_URL}/graphql",
            json={"query": mutation, "variables": variables}
        )
        response.raise_for_status()
        return response.json()

async def validar_reserva_disponible(amenidad, fecha, horaInicio, horaFin, residenciaId, conjuntoId, excluirId=None):
    query = '''
    query ValidarDisponibilidad($amenidad: String!, $fecha: String!, $horaInicio: String!, $horaFin: String!, $residenciaId: ID!, $conjuntoId: ID!, $excluirId: ID) {
      validarReservaDisponible(amenidad: $amenidad, fecha: $fecha, horaInicio: $horaInicio, horaFin: $horaFin, residenciaId: $residenciaId, conjuntoId: $conjuntoId, excluirId: $excluirId) {
        disponible
        motivo
      }
    }
    '''
    variables = {
        "amenidad": amenidad,
        "fecha": fecha,
        "horaInicio": horaInicio,
        "horaFin": horaFin,
        "residenciaId": residenciaId,
        "conjuntoId": conjuntoId,
        "excluirId": excluirId
    }
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{RESIDENCE_MS_URL}/graphql",
            json={"query": query, "variables": variables}
        )
        response.raise_for_status()
        data = response.json()
        return data["data"]["validarReservaDisponible"]

async def editar_reserva(id_reserva, reserva_data):
    mutation = '''
    mutation EditarReserva($id: ID!, $reserva: ReservaInput!) {
      editarReserva(id: $id, reserva: $reserva) {
        id
        conjuntoId
        residenciaId
        amenidad
        fecha
        horaInicio
        horaFin
        cantidadPersonas
        motivo
        estado
        observaciones
      }
    }
    '''
    variables = {"id": id_reserva, "reserva": reserva_data}
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{RESIDENCE_MS_URL}/graphql",
            json={"query": mutation, "variables": variables}
        )
        response.raise_for_status()
        return response.json()

async def eliminar_reserva(id_reserva):
    mutation = '''
    mutation EliminarReserva($id: ID!) {
      eliminarReserva(id: $id)
    }
    '''
    variables = {"id": id_reserva}
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{RESIDENCE_MS_URL}/graphql",
            json={"query": mutation, "variables": variables}
        )
        response.raise_for_status()
        return response.json()

# esto es temporal, debe usar el token 
async def obtener_conjuntos_residencias():
    query = '''
    query {
      conjuntos {
        id
        nombre
      }
      residences {
        id
        code
        conjuntoId
      }
    }
    '''
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{RESIDENCE_MS_URL}/graphql",
            json={"query": query}
        )
        response.raise_for_status()
        data = response.json()
        return {
            "conjuntos": data["data"]["conjuntos"],
            "residencias": data["data"]["residences"]
        }
  
# esto es temporal, debe usar el token 
async def obtener_reservas(residenciaId=None):
    query = '''
    query Reservas($residenciaId: ID) {
      reservas(residenciaId: $residenciaId) {
        id
        conjuntoId
        residenciaId
        amenidad
        fecha
        horaInicio
        horaFin
        estado
        motivo
        cantidadPersonas
        observaciones
      }
    }
    '''
    variables = {"residenciaId": residenciaId}
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{RESIDENCE_MS_URL}/graphql",
            json={"query": query, "variables": variables}
        )
        response.raise_for_status()
        data = response.json()
        return data["data"]["reservas"]