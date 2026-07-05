from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from routers.analysis import router as analysis_router

app = FastAPI(
    title="DecisionHub AI API",
    description="AI Decision Intelligence Platform for Community Resilience",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analysis_router)

static_dir = Path(__file__).parent / "static"
if static_dir.exists():
    app.mount("/assets", StaticFiles(directory=static_dir / "assets"), name="assets")


@app.get("/health")
def health_check():
    return {"status": "ok", "service": "decisionhub-ai"}


@app.get("/")
def serve_frontend():
    index_file = static_dir / "index.html"
    if index_file.exists():
        return FileResponse(index_file)
    return {"service": "DecisionHub AI API", "docs": "/docs", "health": "/health"}
