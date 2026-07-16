from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.repositories.task_repository import TaskRepository
from app.schemas.task import (
    TaskCreate,
    TaskUpdate,
    TaskResponse
)
from app.services.task_service import TaskService

router = APIRouter(
    prefix="/tasks",
    tags=["Tasks"]
)


@router.get("/", response_model=list[TaskResponse])
def get_tasks(db: Session = Depends(get_db)):
    service = TaskService(TaskRepository(db))
    return service.get_all_tasks()


@router.get("/{task_id}", response_model=TaskResponse)
def get_task(task_id: int, db: Session = Depends(get_db)):

    service = TaskService(TaskRepository(db))

    task = service.get_task_by_id(task_id)

    if not task:
        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )

    return task


@router.post("/", response_model=TaskResponse)
def create_task(
    task: TaskCreate,
    db: Session = Depends(get_db)
):

    service = TaskService(TaskRepository(db))

    return service.create_task(task)


@router.put("/{task_id}", response_model=TaskResponse)
def update_task(
    task_id: int,
    task: TaskUpdate,
    db: Session = Depends(get_db)
):

    service = TaskService(TaskRepository(db))

    db_task = service.get_task_by_id(task_id)

    if not db_task:
        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )

    return service.update_task(db_task, task)


@router.delete("/{task_id}")
def delete_task(
    task_id: int,
    db: Session = Depends(get_db)
):

    service = TaskService(TaskRepository(db))

    db_task = service.get_task_by_id(task_id)

    if not db_task:
        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )

    service.delete_task(db_task)

    return {
        "message": "Task deleted successfully"
    }