from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.repositories.report_repository import ReportRepository
from app.services.report_service import ReportService

router = APIRouter(
    prefix="/reports",
    tags=["Reports"]
)


@router.get("/dashboard")
def get_dashboard_stats(
    db: Session = Depends(get_db)
):

    service = ReportService(
        ReportRepository(db)
    )

    return service.get_dashboard_stats()

@router.get("/task-status")
def get_task_status_summary(
    db: Session = Depends(get_db)
):

    service = ReportService(
        ReportRepository(db)
    )

    return service.get_task_status_summary()

@router.get("/top-performers")
def get_top_performers(
    db: Session = Depends(get_db)
):

    service = ReportService(
        ReportRepository(db)
    )

    return service.get_top_performers()