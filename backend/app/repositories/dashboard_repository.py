from datetime import date

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.project import Project
from app.models.client import Client
from app.models.task import Task
from app.models.user import User


class DashboardRepository:

    def __init__(self, db: Session):
        self.db = db

    # ==========================================================
    # Dashboard Statistics
    # ==========================================================

    def get_dashboard_stats(self):
        return {
            "total_projects": self.db.query(Project)
            .filter(Project.is_active == True)
            .count(),

            "active_projects": self.db.query(Project)
            .filter(
                Project.is_active == True,
                Project.status == "In Progress"
            )
            .count(),

            "delayed_projects": self.db.query(Project)
            .filter(
                Project.is_active == True,
                Project.status == "Delayed"
            )
            .count(),

            "total_clients": self.db.query(Client)
            .filter(Client.is_active == True)
            .count(),

            "total_employees": self.db.query(User)
            .filter(User.is_active == True)
            .count(),

            "total_tasks": self.db.query(Task)
            .filter(Task.is_active == True)
            .count()
        }

    # ==========================================================
    # Projects Requiring Attention
    # ==========================================================

    def get_attention_projects(self):

        projects = (
            self.db.query(Project)
            .filter(Project.is_active == True)
            .order_by(Project.end_date.asc())
            .limit(5)
            .all()
        )

        data = []

        for project in projects:

            client = (
                self.db.query(Client)
                .filter(Client.id == project.client_id)
                .first()
            )

            manager = (
                self.db.query(User)
                .filter(User.id == project.manager_id)
                .first()
            )

            data.append({

                "id": project.id,

                "name": project.name,

                "client": (
                    client.company_name
                    if client
                    else "-"
                ),

                "manager": (
                    manager.full_name
                    if manager
                    else "-"
                ),

                "status": project.status,

                "priority": project.priority,

                "progress": project.progress,

                "deadline": (
                    project.end_date.strftime("%d %b %Y")
                    if project.end_date
                    else "-"
                )

            })

        return data
    
        # ==========================================================
    # Recently Added Clients
    # ==========================================================

    def get_recent_clients(self):

        clients = (
            self.db.query(Client)
            .filter(Client.is_active == True)
            .order_by(Client.created_at.desc())
            .limit(5)
            .all()
        )

        data = []

        for client in clients:

            project_count = (
                self.db.query(Project)
                .filter(
                    Project.client_id == client.id,
                    Project.is_active == True
                )
                .count()
            )

            data.append({

                "id": client.id,

                "company": client.company_name,

                "industry": client.industry or "-",

                "projects": project_count,

                "status": client.status

            })

        return data

    # ==========================================================
    # Upcoming Deadlines
    # ==========================================================

    def get_upcoming_deadlines(self):

        today = date.today()

        projects = (
            self.db.query(Project)
            .filter(
                Project.is_active == True,
                Project.end_date != None,
                Project.end_date >= today
            )
            .order_by(Project.end_date.asc())
            .limit(5)
            .all()
        )

        data = []

        for project in projects:

            data.append({

                "id": project.id,

                "project": project.name,

                "stage": project.status,

                "deadline": project.end_date.strftime("%d %b %Y")

            })

        return data

    # ==========================================================
    # Employee Workload
    # ==========================================================

    def get_employee_workload(self):

        employees = (
            self.db.query(User)
            .filter(User.is_active == True)
            .all()
        )

        data = []

        for employee in employees:

            total_tasks = (
                self.db.query(Task)
                .filter(
                    Task.assigned_to == employee.id,
                    Task.is_active == True
                )
                .count()
            )

            workload = min(total_tasks * 10, 100)

            data.append({

                "id": employee.id,

                "employee": employee.full_name,

                "workload": workload

            })

        data.sort(
            key=lambda x: x["workload"],
            reverse=True
        )

        return data[:5]

    # ==========================================================
    # Dashboard Data
    # ==========================================================

    def get_dashboard_data(self):

        return {

            "stats": self.get_dashboard_stats(),

            "attention_projects": self.get_attention_projects(),

            "recent_clients": self.get_recent_clients(),

            "upcoming_deadlines": self.get_upcoming_deadlines(),

            "employee_workload": self.get_employee_workload()

        }