from datetime import datetime
from pydantic import BaseModel, ConfigDict


class ProjectTeamMemberResponse(BaseModel):
    id: int
    full_name: str
    email: str
    designation: str | None = None
    department: str | None = None
    employee_code: str | None = None
    phone: str | None = None

    model_config = ConfigDict(from_attributes=True)


class AssignProjectMemberRequest(BaseModel):
    user_id: int


class AssignProjectMemberResponse(BaseModel):
    message: str