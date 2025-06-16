from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers.auth_ms_router import router as auth_ms_router

#from app.routers.residence_ms_router import router as residence_ms_router
#from app.routers.messaging_ms_router import router as messaging_ms_router
#from app.routers.statistics_ms_router import router as statistics_ms_router
from app.routers.orchestration_router import router as orchestration_router

app = FastAPI(title="COLive API Gateway")

# Middleware para permitir CORS desde cualquier origen (útil en desarrollo)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, limitarlo al dominio frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_ms_router, prefix="/auth")
#app.include_router(residence_ms_router, prefix="/residence")
#app.include_router(messaging_ms_router, prefix="/messaging")
#app.include_router(statistics_ms_router, prefix="/statistics")
app.include_router(orchestration_router, prefix="/orc")
