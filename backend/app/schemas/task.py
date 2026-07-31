from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel


class TaskBase(BaseModel):

    title: str
    description: Optional[str] = None

    module_id: int
    assigned_to: Optional[int] = None

    priority: str
    status: str

    start_date: Optional[date] = None
    due_date: Optional[date] = None

    estimated_hours: int = 0
    actual_hours: int = 0


class TaskCreate(TaskBase):
    pass


class TaskUpdate(BaseModel):

    title: Optional[str] = None
    description: Optional[str] = None

    module_id: Optional[int] = None
    assigned_to: Optional[int] = None

    priority: Optional[str] = None
    status: Optional[str] = None

    start_date: Optional[date] = None
    due_date: Optional[date] = None

    estimated_hours: Optional[int] = None
    actual_hours: Optional[int] = None

    is_active: Optional[bool] = None


class TaskResponse(TaskBase):

    id: int

    is_active: bool

    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True