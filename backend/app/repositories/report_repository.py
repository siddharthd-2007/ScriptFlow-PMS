from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.project import Project
from app.models.user import User
from app.models.task import Task
from app.models.client import Client


class ReportRepository:

    def __init__(self, db: Session):
        self.db = db

    def get_dashboard_stats(self):

        return {

            "projects":
                self.db.query(Project)
                .filter(Project.is_active == True)
                .count(),

            "employees":
                self.db.query(User)
                .filter(User.is_active == True)
                .count(),

            "tasks":
                self.db.query(Task)
                .filter(Task.is_active == True)
                .count(),

            "clients":
                self.db.query(Client)
                .filter(Client.is_active == True)
                .count()

        }

    def get_task_status_summary(self):

        results = (
            self.db.query(
                Task.status,
                func.count(Task.id)
            )
            .filter(Task.is_active == True)
            .group_by(Task.status)
            .all()
        )

        summary = {}

        for status, count in results:
            summary[status] = count

        return summary
    def get_top_performers(self):
            results = (
        self.db.query(
            User.full_name,
            func.count(Task.id).label("completed_tasks")
        )
        .join(
            Task,
            Task.assigned_to == User.id
        )
        .filter(
            User.is_active == True,
            Task.is_active == True,
            Task.status == "Completed"
        )
        .group_by(User.id, User.full_name)
        .order_by(
            func.count(Task.id).desc()
        )
        .limit(5)
        .all()
    )
            return [
        {
            "name": name,
            "completed_tasks": completed_tasks
        }
        for name, completed_tasks in results
    ]