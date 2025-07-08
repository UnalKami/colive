from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from app.services.residence_ms_services import (
    crear_reserva, validar_reserva_disponible,
    editar_reserva, eliminar_reserva,
    obtener_conjuntos_residencias, obtener_reservas, obtener_panel_propietario, crear_residence_con_admin, crear_usuario_propiedad_con_admin
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

class CrearResidenceRequest(BaseModel):
    code: str
    parqueadero: int = None
    bodega: int = None

class UsuarioData(BaseModel):
    nombre: str
    correo: str
    username: str
    password: str
    celular: str = "0"
    rol: str = "PROPIEDAD_CR"  # ✅ CORREGIDO A PROPIEDAD_CR

class ResidenceData(BaseModel):
    code: str
    parqueadero: int = None
    bodega: int = None

class CrearUsuarioPropiedadRequest(BaseModel):
    user: UsuarioData
    residence: ResidenceData

@router.post("/crear-residence")
async def crear_residence(request: CrearResidenceRequest, http_request: Request):
    try:
        return await crear_residence_con_admin(request.dict(), http_request.cookies)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/crear-usuario-propiedad")
async def crear_usuario_propiedad(request: CrearUsuarioPropiedadRequest, http_request: Request):
    try:
        return await crear_usuario_propiedad_con_admin(request.dict(), http_request.cookies)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

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