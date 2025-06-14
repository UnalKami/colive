from fastapi import FastAPI
from app.routers.auth_ms_router import router as auth_ms_router
#from app.routers.residence_ms_router import router as residence_ms_router
#from app.routers.messaging_ms_router import router as messaging_ms_router
#from app.routers.statistics_ms_router import router as statistics_ms_router
#from app.routers.orchestration_router import router as orchestration_router

app = FastAPI(title="COLive API Gateway")

app.include_router(auth_ms_router, prefix="/auth")
#app.include_router(residence_ms_router, prefix="/residence")
#app.include_router(messaging_ms_router, prefix="/messaging")
#app.include_router(statistics_ms_router, prefix="/statistics")
#app.include_router(orchestration_router, prefix="/orc")
