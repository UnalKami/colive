# app/routers/personal.py

from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from sqlalchemy.orm import Session
from app import crud, schemas, models
from app.database import SessionLocal, engine
from sqlalchemy.exc import IntegrityError

# Asegurarnos de crear las tablas (solo en desarrollo)
models.Base.metadata.create_all(bind=engine)

router = APIRouter(
    prefix="/personal",
    tags=["Personal"]
)

# Dependency para obtener la sesión de BD en cada request
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=schemas.PersonalOut, status_code=status.HTTP_201_CREATED)
def crear_nuevo_personal(personal_in: schemas.PersonalCreate, db: Session = Depends(get_db)):
    # Validar que no exista un email duplicado
    if personal_in.email:
        existente = crud.get_personal_por_email(db, personal_in.email)
        if existente:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Ya existe un personal con ese email."
            )
    try:
        nuevo = crud.crear_personal(db, personal_in)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Error al crear personal."
        )
    return nuevo

@router.get("/", response_model=List[schemas.PersonalOut])
def listar_personal(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_personal(db, skip=skip, limit=limit)

@router.get("/{personal_id}", response_model=schemas.PersonalOut)
def obtener_personal(personal_id: int, db: Session = Depends(get_db)):
    p = crud.get_personal_por_id(db, personal_id)
    if not p:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Personal no encontrado.")
    return p

@router.put("/{personal_id}", response_model=schemas.PersonalOut)
def editar_personal(personal_id: int, personal_in: schemas.PersonalUpdate, db: Session = Depends(get_db)):
    p = crud.get_personal_por_id(db, personal_id)
    if not p:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Personal no encontrado.")
    # Si actualizan email, verificar duplicado
    if personal_in.email and personal_in.email != p.email:
        existente = crud.get_personal_por_email(db, personal_in.email)
        if existente:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Ya existe un personal con ese email."
            )
    actualizado = crud.actualizar_personal(db, p, personal_in)
    return actualizado

@router.delete("/{personal_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_personal(personal_id: int, db: Session = Depends(get_db)):
    p = crud.get_personal_por_id(db, personal_id)
    if not p:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Personal no encontrado.")
    crud.borrar_personal(db, p)
    return None
