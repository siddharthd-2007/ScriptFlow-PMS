from datetime import date
from typing import List, Optional

from pydantic import BaseModel


class TimelineProject(BaseModel):
    id: int
    name: str
    start_date: Optional[date]
    end_date: Optional[date]
    progress: int
    status: str

    class Config:
        from_attributes = True


class TimelineModule(BaseModel):
    id: int
    name: str
    start_date: Optional[date]
    end_date: Optional[date]
    progress: int
    status: str

    class Config:
        from_attributes = True


class TimelineTask(BaseModel):
    id: int
    title: str
    module_id: int
    start_date: Optional[date]
    due_date: Optional[date]
    status: str

    class Config:
        from_attributes = True


class TimelineResponse(BaseModel):
    project: TimelineProject
    modules: List[TimelineModule]
    tasks: List[TimelineTask]