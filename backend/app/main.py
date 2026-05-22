from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routes import sessions, exercises

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Zapobiegawczo API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(sessions.router, prefix="/sessions", tags=["sessions"])
app.include_router(exercises.router, prefix="/exercises", tags=["exercises"])

@app.get("/")
def root():
    return {"message": "Zapobiegawczo API działa! 🧘"}
