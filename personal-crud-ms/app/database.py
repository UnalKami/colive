# app/database.py

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv

# Cargar variables de entorno desde .env (opcional)
load_dotenv()

# EJEMPLO con SQLite. Si quisieras Postgres, usarías:
#   DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:pass@localhost/dbname")
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./personnel.db")

# Para SQLite, habilitamos check_same_thread=False
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
)

# Cada vez que necesitemos una session, usamos SessionLocal()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
