# from pydantic import BaseModel
# from typing import Optional
# from appointments.schemas import AppointmentOut
# from models import DayOfWeek

# # -------------------------------
# # Doctor creation (admin only)
# # -------------------------------
# class DoctorCreate(BaseModel):
#     name: str
#     email: str
#     specialty: str

# # -------------------------------
# # Doctor schedule creation
# # -------------------------------
# class ScheduleCreate(BaseModel):
#     day: DayOfWeek         # must match the DayOfWeek enum: MONDAY, TUESDAY, etc.
#     start_time: str        # "HH:MM"
#     end_time: str          # "HH:MM"



from pydantic import BaseModel
from models import DayOfWeek  # Make sure this is the Enum from models.py

class DoctorCreate(BaseModel):
    name: str
    email: str
    specialty: str

class ScheduleCreate(BaseModel):
    day: DayOfWeek  # Must be Enum
    start_time: str  # Format: "HH:MM"
    end_time: str    # Format: "HH:MM"
