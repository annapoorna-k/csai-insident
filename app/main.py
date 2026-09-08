from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

from app.api.routes.health import router as health_router
from app.api.routes.investigations import (
    router as investigations_router,
)
from app.api.routes.incidents import (
    router as incidents_router,
)


app = FastAPI(
    title="Cybersecurity AI Agent",
    description="Multi-agent cybersecurity investigation system",
    version="1.0.0",
)


# ---------------------------------------------------------
# CORS Configuration
# ---------------------------------------------------------
# Allow the React/Vite frontend to communicate with FastAPI
# during local development and Docker testing.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------
# API Routes
# ---------------------------------------------------------
app.include_router(
    health_router,
)

app.include_router(
    investigations_router,
)

app.include_router(
    incidents_router,
)
