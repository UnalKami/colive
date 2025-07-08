from fastapi import APIRouter, HTTPException, Header, Depends
from pydantic import BaseModel
from app.services.residence_ms_services import (
    crear_reserva, validar_reserva_disponible,
    editar_reserva, eliminar_reserva,
    obtener_conjuntos_residencias, obtener_reservas,
    obtener_panel_propietario,
    registrar_visitante_peaton, registrar_visitante_vehicular,
    registrar_salida_vehiculo, obtener_visitantes_conjunto
)

router = APIRouter()

class ReservaInput(BaseModel):
    conjuntoId: str
    residenciaId: str
    amenidad: str
    fecha: str
    horaInicio: str
    horaFin: str
    cantidadPersonas: int
    motivo: str = None
    estado: str = None
    observaciones: str = None

class EditarReservaInput(BaseModel):
    id: str
    reserva: ReservaInput

class EliminarReservaInput(BaseModel):
    id: str

class VisitantePeatonInput(BaseModel):
    nombreVisitante: str
    visitanteDocumento: str
    destino: str
    nombreAutoriza: str
    idConjunto: str

class VisitanteVehicularInput(BaseModel):
    nombreVisitante: str
    visitanteDocumento: str
    destino: str
    nombreAutoriza: str
    placaVehiculo: str
    tipoVehiculo: str
    espacioAsignado: int
    idConjunto: str

class SalidaVehiculoInput(BaseModel):
    placaVehiculo: str
    idConjunto: str

@router.post("/crearReserva")
async def crear_reserva_endpoint(reserva: ReservaInput):
    # Validación de solapamiento y doble reserva
    validacion = await validar_reserva_disponible(
        amenidad=reserva.amenidad,
        fecha=reserva.fecha,
        horaInicio=reserva.horaInicio,
        horaFin=reserva.horaFin,
        residenciaId=reserva.residenciaId,
        conjuntoId=reserva.conjuntoId
    )
    if not validacion.get("disponible", False):
        return {
            "disponible": False,
            "motivo": validacion.get("motivo", "Reserva no disponible")
        }
    try:
        reserva_result = await crear_reserva(reserva.dict())
        return {
            "disponible": True,
            "reserva": reserva_result.get("data", {}).get("crearReserva"),
            "motivo": None
        }
    except Exception as e:
        return {
            "disponible": False,
            "motivo": "Error interno al crear la reserva."
        }

@router.post("/editarReserva")
async def editar_reserva_endpoint(data: EditarReservaInput):
    # Validación de solapamiento y doble reserva
    validacion = await validar_reserva_disponible(
        amenidad=data.reserva.amenidad,
        fecha=data.reserva.fecha,
        horaInicio=data.reserva.horaInicio,
        horaFin=data.reserva.horaFin,
        residenciaId=data.reserva.residenciaId,
        conjuntoId=data.reserva.conjuntoId,
        excluirId=data.id
    )
    if not validacion.get("disponible", False):
        return {
            "disponible": False,
            "motivo": validacion.get("motivo", "Reserva no disponible")
        }
    try:
        reserva_result = await editar_reserva(data.id, data.reserva.dict())
        return {
            "disponible": True,
            "reserva": reserva_result.get("data", {}).get("editarReserva"),
            "success": True
        }
    except Exception as e:
        return {
            "disponible": False,
            "motivo": "Error interno al editar la reserva.",
            "success": False
        }

@router.post("/eliminarReserva")
async def eliminar_reserva_endpoint(data: EliminarReservaInput):
    try:
        result = await eliminar_reserva(data.id)
        return {"success": result.get("data", {}).get("eliminarReserva", False)}
    except Exception as e:
        return {"success": False, "motivo": "Error interno al eliminar la reserva."}

# esto es temporal, debe usar el token 
@router.get("/conjuntosResidencias")
async def conjuntos_residencias_endpoint():
    try:
        data = await obtener_conjuntos_residencias()
        return data
    except Exception as e:
        return {"error": str(e)}

# esto es temporal, debe usar el token 
@router.get("/reservas")
async def obtener_reservas_endpoint(residenciaId: str = None):
    try:
        data = await obtener_reservas(residenciaId=residenciaId)
        return {"reservas": data}
    except Exception as e:
        return {"error": str(e)}

@router.get("/panelPropietario")
async def panel_propietario_endpoint():
    try:
        data = await obtener_panel_propietario()
        return data
    except Exception as e:
        return {"error": str(e)}

# Middleware para verificar autenticación
async def verify_auth_token(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Token no proporcionado")
    
    token = authorization.split(" ")[1]
    try:
        from app.services.auth_ms_services import verify_token
        user_data = await verify_token(token)
        return user_data
    except Exception as e:
        raise HTTPException(status_code=401, detail="Token inválido")

# Endpoints para visitantes
@router.post("/visitantes/peaton")
async def registrar_peaton_endpoint(visitante: VisitantePeatonInput, user_data: dict = Depends(verify_auth_token)):
    if user_data.get('role_name') != 'VIGILANTE':
        raise HTTPException(status_code=403, detail="Acceso denegado")
    
    try:
        result = await registrar_visitante_peaton(visitante.dict())
        return result
    except Exception as e:
        return {"error": str(e)}

@router.post("/visitantes/vehicular")
async def registrar_vehicular_endpoint(visitante: VisitanteVehicularInput, user_data: dict = Depends(verify_auth_token)):
    if user_data.get('role_name') != 'VIGILANTE':
        raise HTTPException(status_code=403, detail="Acceso denegado")
    
    try:
        result = await registrar_visitante_vehicular(visitante.dict())
        return result
    except Exception as e:
        return {"error": str(e)}

@router.post("/visitantes/vehicular/salida")
async def registrar_salida_endpoint(salida: SalidaVehiculoInput, user_data: dict = Depends(verify_auth_token)):
    if user_data.get('role_name') != 'VIGILANTE':
        raise HTTPException(status_code=403, detail="Acceso denegado")
    
    try:
        result = await registrar_salida_vehiculo(salida.dict())
        return result
    except Exception as e:
        return {"error": str(e)}

@router.get("/visitantes/conjunto/{idConjunto}")
async def obtener_visitantes_endpoint(idConjunto: str, fecha: str = None, user_data: dict = Depends(verify_auth_token)):
    if user_data.get('role_name') != 'VIGILANTE':
        raise HTTPException(status_code=403, detail="Acceso denegado")
    
    try:
        result = await obtener_visitantes_conjunto(idConjunto, fecha)
        return result
    except Exception as e:
        return {"error": str(e)}