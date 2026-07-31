from sqlalchemy.orm import Session

from app.models.task import Task
from app.models.project import Project
from app.models.module import Module


class CalendarRepository:

    def __init__(self, db: Session):
        self.db = db

    def get_calendar_tasks(self):

        tasks = (
            self.db.query(Task)
            .filter(Task.is_active == True)
            .all()
        )

        projects = (
            self.db.query(Project)
            .filter(Project.is_active == True)
            .all()
        )

        modules = (
            self.db.query(Module)
            .filter(Module.is_active == True)
            .all()
        )

        events = []

        # ----------------------------
        # Tasks
        # ----------------------------

        for task in tasks:

            events.append({

    "id": task.id,
    "title": task.title,
    "date": task.due_date,
    "type": "task",
    "url": f"task-details.html?id={task.id}"

      })

        # ----------------------------
        # Projects
        # ----------------------------

        for project in projects:

            events.append({

    "id": project.id,
    "title": project.name,
    "date": project.end_date,
    "type": "project",
    "url": f"project-details.html?id={project.id}"

      })

        # ----------------------------
        # Modules
        # ----------------------------

        for module in modules:

            events.append({

    "id": module.id,
    "title": module.name,
    "date": module.end_date,
    "type": "module",
    "url": f"module-details.html?id={module.id}"

           })

        return events