import httpx
from app.config import RESIDENCE_MS_URL

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