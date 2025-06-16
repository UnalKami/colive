from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.residence_ms_services import crear_reserva

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

@router.post("/residence/reservas")
async def crear_reserva_endpoint(reserva: ReservaInput):
    try:
        return await crear_reserva(reserva.dict())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))