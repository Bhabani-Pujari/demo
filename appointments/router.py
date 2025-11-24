from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from db import get_db
from models import Appointment, Doctor, UserRole
from auth.utils import get_current_user, admin_required
from appointments.schemas import AppointmentCreate, AppointmentOut
from typing import List

router = APIRouter(prefix="/appointments", tags=["appointments"])

# Book appointment
@router.post("/", response_model=AppointmentOut)
def book_appointment(request: AppointmentCreate, current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != UserRole.PATIENT:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only patients can book appointments")
    doctor = db.query(Doctor).get(request.doctor_id)
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    existing = db.query(Appointment).filter(
        Appointment.doctor_id==request.doctor_id,
        Appointment.date==request.date,
        Appointment.time==request.time
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Doctor not available at this time")
    appt = Appointment(doctor_id=request.doctor_id, patient_id=current_user.id, date=request.date, time=request.time)
    db.add(appt)
    db.commit()
    db.refresh(appt)
    return appt

# Get my appointments
@router.get("/me", response_model=List[AppointmentOut])
def get_my_appointments(current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != UserRole.PATIENT:
        raise HTTPException(status_code=403, detail="Only patients can view their appointments")
    return db.query(Appointment).filter(Appointment.patient_id==current_user.id).all()

# Get all appointments (admin)
@router.get("/all", dependencies=[Depends(admin_required)])
def get_all_appointments(db: Session = Depends(get_db)):
    return db.query(Appointment).all()

# Cancel
@router.delete("/{appointment_id}")
def cancel_appointment(appointment_id: int, current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    appt = db.query(Appointment).get(appointment_id)
    if not appt:
        raise HTTPException(status_code=404, detail="Appointment not found")
    if current_user.role == UserRole.PATIENT and appt.patient_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    db.delete(appt)
    db.commit()
    return {"message": "Appointment cancelled successfully"}
