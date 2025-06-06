from sqlalchemy import Column, Integer, String
from app.db.base_class import Base

class Personal(Base):
    __tablename__ = "personal"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    rol = Column(String, nullable=False)  # Ej: vigilancia, aseo, etc.
    telefono = Column(String, nullable=True)
    correo = Column(String, unique=True, index=True)
