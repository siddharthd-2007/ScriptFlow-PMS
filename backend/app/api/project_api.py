from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.repositories.project_repository import ProjectRepository
from app.schemas.project import (
    ProjectCreate,
    ProjectUpdate,
    ProjectResponse,
)
from app.services.project_service import ProjectService

router = APIRouter(
    prefix="/projects",
    tags=["Projects"]
)


@router.get("/", response_model=list[ProjectResponse])
def get_projects(db: Session = Depends(get_db)):
    service = ProjectService(ProjectRepository(db))
    return service.get_all_projects()


@router.get("/{project_id}", response_model=ProjectResponse)
def get_project(project_id: int, db: Session = Depends(get_db)):
    service = ProjectService(ProjectRepository(db))

    project = service.get_project_by_id(project_id)

    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    return project

@router.get("/client/{client_id}", response_model=list[ProjectResponse])
def get_projects_by_client(
    client_id: int,
    db: Session = Depends(get_db)
):
    service = ProjectService(ProjectRepository(db))

    return service.get_projects_by_client(client_id)

@router.post("/", response_model=ProjectResponse)
def create_project(
    project: ProjectCreate,
    db: Session = Depends(get_db)
):
    service = ProjectService(ProjectRepository(db))
    return service.create_project(project)


@router.put("/{project_id}", response_model=ProjectResponse)
def update_project(
    project_id: int,
    project: ProjectUpdate,
    db: Session = Depends(get_db)
):
    service = ProjectService(ProjectRepository(db))

    db_project = service.get_project_by_id(project_id)

    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")

    return service.update_project(db_project, project)


@router.delete("/{project_id}")
def delete_project(
    project_id: int,
    db: Session = Depends(get_db)
):
    service = ProjectService(ProjectRepository(db))

    db_project = service.get_project_by_id(project_id)

    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")

    service.delete_project(db_project)

    return {"message": "Project deactivated successfully"}