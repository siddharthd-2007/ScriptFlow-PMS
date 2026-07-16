from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class ProjectBase(BaseModel):
    client_id: int
    name: str
    description: Optional[str] = None
    status: str = "Planning"
    priority: str = "Medium"
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    manager_id: Optional[int] = None


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    client_id: Optional[int] = None
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    manager_id: Optional[int] = None
    progress: Optional[int] = None


class ProjectResponse(ProjectBase):
    id: int
    progress: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)