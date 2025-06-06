# app/schemas.py

from pydantic import BaseModel, EmailStr, constr
from datetime import datetime
from typing import Optional
from app.models import RolEnum

class PersonalBase(BaseModel):
    nombre: constr(min_length=1, max_length=100)
    apellido: constr(min_length=1, max_length=100)
    rol: RolEnum
    telefono: Optional[constr(max_length=20)] = None
    email: Optional[EmailStr] = None
    estado: Optional[constr(min_length=1, max_length=20)] = "activo"

class PersonalCreate(PersonalBase):
    # fecha_contratacion se puede omitir en el request (se dará por defecto)
    pass

class PersonalUpdate(BaseModel):
    nombre: Optional[constr(min_length=1, max_length=100)]
    apellido: Optional[constr(min_length=1, max_length=100)]
    rol: Optional[RolEnum]
    telefono: Optional[constr(max_length=20)]
    email: Optional[EmailStr]
    estado: Optional[constr(min_length=1, max_length=20)]

class PersonalOut(PersonalBase):
    id: int
    fecha_contratacion: datetime
    creado_en: datetime
    actualizado_en: Optional[datetime]

    class Config:
        orm_mode = True
