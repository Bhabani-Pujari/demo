# auth/schemas.py
# from pydantic import BaseModel, EmailStr
# from enum import Enum

# class UserRoleEnum(str, Enum):
#     ADMIN = "ADMIN"
#     PATIENT = "PATIENT"

# class RegisterRequest(BaseModel):
#     name: str
#     email: EmailStr
#     password: str
#     role: UserRoleEnum
    
    
    
from pydantic import BaseModel, EmailStr
from models import UserRole

class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: UserRole

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

    
    
    
    
    
    
    

