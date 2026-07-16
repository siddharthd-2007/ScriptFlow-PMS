from datetime import date
from typing import Optional

from pydantic import BaseModel, EmailStr


class EmployeeCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str

    role: str
    department: Optional[str] = None

    employee_code: Optional[str] = None
    phone: Optional[str] = None
    designation: Optional[str] = None
    joining_date: Optional[date] = None


class EmployeeUpdate(BaseModel):
    full_name: Optional[str] = None
    role: Optional[str] = None
    department: Optional[str] = None

    phone: Optional[str] = None
    designation: Optional[str] = None
    joining_date: Optional[date] = None

    is_active: Optional[bool] = None


class EmployeeResponse(BaseModel):
    id: int

    full_name: str
    email: EmailStr

    role: str
    department: Optional[str]

    employee_code: Optional[str]
    phone: Optional[str]
    designation: Optional[str]
    joining_date: Optional[date]

    is_active: bool

    model_config = {
        "from_attributes": True
    }