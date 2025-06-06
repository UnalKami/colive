# app/crud.py

from sqlalchemy.orm import Session
from typing import List, Optional
from app.models import Personal, RolEnum
from app.schemas import PersonalCreate, PersonalUpdate

def get_personal(db: Session, skip: int = 0, limit: int = 100) -> List[Personal]:
    return db.query(Personal).offset(skip).limit(limit).all()

def get_personal_por_id(db: Session, personal_id: int) -> Optional[Personal]:
    return db.query(Personal).filter(Personal.id == personal_id).first()

def get_personal_por_email(db: Session, email: str) -> Optional[Personal]:
    return db.query(Personal).filter(Personal.email == email).first()

def crear_personal(db: Session, personal_in: PersonalCreate) -> Personal:
    nuevo = Personal(
        nombre=personal_in.nombre,
        apellido=personal_in.apellido,
        rol=personal_in.rol,
        telefono=personal_in.telefono,
        email=personal_in.email,
        estado=personal_in.estado
        # fecha_contratacion se asigna automáticamente
    )
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo

def actualizar_personal(db: Session, personal: Personal, personal_in: PersonalUpdate) -> Personal:
    # Actualiza solo campos que no sean None
    for var, valor in vars(personal_in).items():
        if valor is not None:
            setattr(personal, var, valor)
    db.commit()
    db.refresh(personal)
    return personal

def borrar_personal(db: Session, personal: Personal) -> None:
    db.delete(personal)
    db.commit()
