from pydantic import BaseModel
from typing import Optional

class DoctorInfo(BaseModel):
    id: int
    name: str
    specialty: str

    class Config:
        from_attributes = True

class PatientInfo(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True

class AppointmentOut(BaseModel):
    id: int
    date: str
    time: str
    doctor: DoctorInfo
    patient: PatientInfo

    class Config:
        from_attributes = True

class AppointmentCreate(BaseModel):
    doctor_id: int
    date: str
    time: str
