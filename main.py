# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db import Base, engine
import models

# Import routers
from auth.router import router as auth_router
from doctors.router import router as doctor_router
from appointments.router import router as appointment_router

# ------------------------------
# Create all database tables
# ------------------------------
Base.metadata.create_all(bind=engine)

# ------------------------------
# FastAPI app
# ------------------------------
app = FastAPI(title="HealthTrack Clinic System")

# ------------------------------
# Enable CORS for frontend integration
# ------------------------------
origins = [
    "http://localhost:5500",  # Live Server or HTML frontend
    "http://127.0.0.1:5500",
    "http://localhost:3000",  # React/Vite dev server (optional)
    "*"                        # Allow all origins for testing (optional)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------------------
# Include Routers
# ------------------------------
app.include_router(auth_router)
app.include_router(doctor_router)
app.include_router(appointment_router)

# ------------------------------
# Root endpoint
# ------------------------------
@app.get("/")
def home():
    return {"message": "HealthTrack API Working!"}
