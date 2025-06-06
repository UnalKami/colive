# app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import personal

app = FastAPI(
    title="Servicio de Personal - Colive",
    version="1.0.0",
    description="Microservicio para CRUD de personal (vigilantes, mantenimiento, aseo, admin)."
)

# ----- Configurar CORS para que tu frontend (ej. http://localhost:3000) pueda consumir -----
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    # Agrega aquí las URLs de tu frontend cuando esté en producción, ejemplo:
    # "https://colive-frontend.com"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir el router de “personal”
app.include_router(personal.router)

# Ruta de prueba en la raíz
@app.get("/")
def root():
    return {"mensaje": "Servicio de Personal corriendo ✔️"}
