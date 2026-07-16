from sqlalchemy.orm import Session

from app.models.task import Task


class CalendarRepository:

    def __init__(self, db: Session):
        self.db = db

    def get_calendar_tasks(self):

        return (
            self.db.query(Task)
            .filter(Task.is_active == True)
            .all()
        )