from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.repositories.calendar_repository import CalendarRepository
from app.services.calendar_service import CalendarService

router = APIRouter(
    prefix="/calendar",
    tags=["Calendar"]
)


@router.get("/")
def get_calendar_tasks(db: Session = Depends(get_db)):

    service = CalendarService(
        CalendarRepository(db)
    )

    return service.get_calendar_tasks()