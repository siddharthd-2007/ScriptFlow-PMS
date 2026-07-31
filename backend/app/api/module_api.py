from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.repositories.module_repository import ModuleRepository
from app.schemas.module import (
    ModuleCreate,
    ModuleUpdate,
    ModuleResponse,
)
from app.services.module_service import ModuleService

router = APIRouter(
    prefix="/modules",
    tags=["Modules"]
)


@router.get("/", response_model=list[ModuleResponse])
def get_modules(db: Session = Depends(get_db)):
    service = ModuleService(ModuleRepository(db))
    return service.get_all_modules()


@router.get("/{module_id}", response_model=ModuleResponse)
def get_module(
    module_id: int,
    db: Session = Depends(get_db)
):
    service = ModuleService(ModuleRepository(db))

    module = service.get_module_by_id(module_id)

    if not module:
        raise HTTPException(status_code=404, detail="Module not found")

    return module


@router.get("/project/{project_id}", response_model=list[ModuleResponse])
def get_modules_by_project(
    project_id: int,
    db: Session = Depends(get_db)
):
    service = ModuleService(ModuleRepository(db))
    return service.get_modules_by_project(project_id)


@router.post("/", response_model=ModuleResponse)
def create_module(
    module: ModuleCreate,
    db: Session = Depends(get_db)
):
    service = ModuleService(ModuleRepository(db))
    return service.create_module(module)


@router.put("/{module_id}", response_model=ModuleResponse)
def update_module(
    module_id: int,
    module: ModuleUpdate,
    db: Session = Depends(get_db)
):
    service = ModuleService(ModuleRepository(db))

    db_module = service.get_module_by_id(module_id)

    if not db_module:
        raise HTTPException(status_code=404, detail="Module not found")

    return service.update_module(db_module, module)


@router.delete("/{module_id}")
def delete_module(
    module_id: int,
    db: Session = Depends(get_db)
):
    service = ModuleService(ModuleRepository(db))

    db_module = service.get_module_by_id(module_id)

    if not db_module:
        raise HTTPException(status_code=404, detail="Module not found")

    service.delete_module(db_module)

    return {
        "message": "Module deactivated successfully"
    }