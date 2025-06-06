# app/models.py

from sqlalchemy import Column, Integer, String, DateTime, Enum
from sqlalchemy.sql import func
from app.database import Base
import enum

class RolEnum(str, enum.Enum):
    vigilante = "vigilante"
    mantenimiento = "mantenimiento"
    aseo = "aseo"
    admin = "admin"

class Personal(Base):
    __tablename__ = "personal"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False, index=True)
    apellido = Column(String(100), nullable=False, index=True)
    rol = Column(Enum(RolEnum), nullable=False)
    telefono = Column(String(20), nullable=True)
    email = Column(String(100), nullable=True, unique=True)
    estado = Column(String(20), default="activo")  # p. ej. “activo” / “inactivo”
    fecha_contratacion = Column(DateTime(timezone=True), server_default=func.now())
    creado_en = Column(DateTime(timezone=True), server_default=func.now())
    actualizado_en = Column(DateTime(timezone=True), onupdate=func.now())
