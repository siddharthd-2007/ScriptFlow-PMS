from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class FileBase(BaseModel):

    module_id: int

    original_name: str

    stored_name: str

    file_path: str

    file_size: int

    content_type: Optional[str] = None

    uploaded_by: int


class FileCreate(FileBase):
    pass


class FileUpdate(BaseModel):

    original_name: Optional[str] = None

    stored_name: Optional[str] = None

    file_path: Optional[str] = None

    file_size: Optional[int] = None

    content_type: Optional[str] = None

    uploaded_by: Optional[int] = None


class FileResponse(FileBase):

    id: int

    uploaded_at: datetime

    class Config:
        from_attributes = True