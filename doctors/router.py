from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from doctors.schemas import DoctorCreate, ScheduleCreate
from models import Doctor, DoctorSchedule
from db import get_db
from auth.utils import admin_required

router = APIRouter(prefix="/doctors", tags=["doctors"])

# -------------------------------
# Create a new doctor (admin only)
# -------------------------------
@router.post("/", dependencies=[Depends(admin_required)])
def create_doctor(request: DoctorCreate, db: Session = Depends(get_db)):
    # Check if doctor with same email exists
    if db.query(Doctor).filter(Doctor.email == request.email).first():
        raise HTTPException(status_code=400, detail="Doctor with this email already exists")

    doctor = Doctor(
        name=request.name,
        email=request.email,
        specialty=request.specialty
    )
    db.add(doctor)
    db.commit()
    db.refresh(doctor)
    return {"message": "Doctor created", "doctor_id": doctor.id}

# -------------------------------
# Add weekly schedule for a doctor (admin only)
# -------------------------------
@router.post("/{doctor_id}/schedule", dependencies=[Depends(admin_required)])
def add_schedule(doctor_id: int, request: ScheduleCreate, db: Session = Depends(get_db)):
    doctor = db.query(Doctor).get(doctor_id)
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")

    # Create schedule
    schedule = DoctorSchedule(
        doctor_id=doctor.id,
        day=request.day,
        start_time=request.start_time,
        end_time=request.end_time
    )
    db.add(schedule)
    db.commit()
    db.refresh(schedule)
    return {"message": "Schedule added", "schedule_id": schedule.id}

# -------------------------------
# View all doctors (admin only)
# -------------------------------
@router.get("/", dependencies=[Depends(admin_required)])
def get_all_doctors_admin(db: Session = Depends(get_db)):
    doctors = db.query(Doctor).all()
    result = [
        {"id": doc.id, "name": doc.name, "email": doc.email, "specialty": doc.specialty}
        for doc in doctors
    ]
    return {"doctors": result}

# -------------------------------
# View all doctors (public / patient)
# -------------------------------
@router.get("/all")
def get_all_doctors(db: Session = Depends(get_db)):
    doctors = db.query(Doctor).all()
    return [{"id": d.id, "name": d.name, "specialty": d.specialty} for d in doctors]

# -------------------------------
# Get single doctor detail (public / patient)
# -------------------------------
@router.get("/{doctor_id}")
def get_doctor(doctor_id: int, db: Session = Depends(get_db)):
    doctor = db.query(Doctor).get(doctor_id)
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    # Include schedules if you want patients to see them
    schedules = db.query(DoctorSchedule).filter(DoctorSchedule.doctor_id == doctor.id).all()
    schedules_list = [
        {"id": s.id, "day": s.day, "start_time": s.start_time, "end_time": s.end_time} 
        for s in schedules
    ]
    return {
        "id": doctor.id,
        "name": doctor.name,
        "specialty": doctor.specialty,
        "email": doctor.email,
        "schedules": schedules_list
    }

# -------------------------------
# Delete a doctor (admin only)
# -------------------------------
@router.delete("/{doctor_id}", dependencies=[Depends(admin_required)])
def delete_doctor(doctor_id: int, db: Session = Depends(get_db)):
    doctor = db.query(Doctor).get(doctor_id)
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    db.delete(doctor)
    db.commit()
    return {"message": "Doctor deleted successfully"}

# -------------------------------
# Delete a schedule (admin only)
# -------------------------------
@router.delete("/schedules/{schedule_id}", dependencies=[Depends(admin_required)])
def delete_schedule(schedule_id: int, db: Session = Depends(get_db)):
    schedule = db.query(DoctorSchedule).get(schedule_id)
    if not schedule:
        raise HTTPException(status_code=404, detail="Schedule not found")
    db.delete(schedule)
    db.commit()
    return {"message": "Schedule deleted successfully"}
