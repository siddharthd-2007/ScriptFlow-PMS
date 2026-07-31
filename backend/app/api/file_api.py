import os
import uuid

from fastapi import (
    APIRouter,
    Depends,
    UploadFile,
    File,
    Form,
    HTTPException,
    status,
)

from app.api.dependencies import get_current_user
from app.models.user import User

from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.repositories.file_repository import FileRepository
from app.schemas.file import FileCreate, FileResponse as FileSchema
from app.services.file_service import FileService


router = APIRouter(
    prefix="/files",
    tags=["Files"],
)

UPLOAD_FOLDER = "uploads/modules"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

ALLOWED_EXTENSIONS = {
    ".pdf",
    ".doc",
    ".docx",
    ".xls",
    ".xlsx",
    ".ppt",
    ".pptx",
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".txt",
    ".zip",
    ".rar",
}

MAX_FILE_SIZE = 25 * 1024 * 1024  # 25 MB


@router.post(
    "/upload",
    response_model=FileSchema,
    status_code=status.HTTP_201_CREATED,
)


def upload_file(
    module_id: int = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    
    
    service = FileService(FileRepository(db))

    extension = os.path.splitext(file.filename)[1].lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="File type not allowed.",
        )

    file_bytes = file.file.read()

    if len(file_bytes) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail="Maximum file size is 25 MB.",
        )

    stored_name = f"{uuid.uuid4()}{extension}"
    file_path = os.path.join(UPLOAD_FOLDER, stored_name)
    file_path = file_path.replace("\\", "/")

    with open(file_path, "wb") as buffer:
        buffer.write(file_bytes)

    file_data = FileCreate(
        module_id=module_id,
        uploaded_by=current_user.id,
        original_name=file.filename,
        stored_name=stored_name,
        file_path=file_path,
        file_size=len(file_bytes),
        content_type=file.content_type,
    )

    return service.create_file(file_data)


@router.get(
    "/module/{module_id}",
    response_model=list[FileSchema],
)
def get_module_files(
    module_id: int,
    db: Session = Depends(get_db),
):
    service = FileService(FileRepository(db))
    return service.get_files_by_module(module_id)
@router.get(
    "/project/{project_id}",
    response_model=list[FileSchema],
)
def get_project_files(
    project_id: int,
    db: Session = Depends(get_db),
):
    service = FileService(FileRepository(db))
    return service.get_files_by_project(project_id)


@router.get("/download/{file_id}")
def download_file(
    file_id: int,
    db: Session = Depends(get_db),
):
    service = FileService(FileRepository(db))

    db_file = service.get_file_by_id(file_id)

    if not db_file:
        raise HTTPException(
            status_code=404,
            detail="File not found",
        )

    return FileResponse(
        path=db_file.file_path,
        filename=db_file.original_name,
        media_type=db_file.content_type,
    )


@router.delete("/{file_id}")
def delete_file(
    file_id: int,
    db: Session = Depends(get_db),
):
    service = FileService(FileRepository(db))

    db_file = service.get_file_by_id(file_id)

    if not db_file:
        raise HTTPException(
            status_code=404,
            detail="File not found",
        )

    if os.path.exists(db_file.file_path):
        os.remove(db_file.file_path)

    service.delete_file(db_file)

    return {
        "message": "File deleted successfully"
    }