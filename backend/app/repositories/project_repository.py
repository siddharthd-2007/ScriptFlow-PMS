from sqlalchemy.orm import Session

from app.models.project import Project
from app.models.project_member import ProjectMember
from app.models.user import User

from app.schemas.project import ProjectCreate, ProjectUpdate

from app.models.module import Module
from app.models.task import Task


class ProjectRepository:

    def __init__(self, db: Session):
        self.db = db

    def get_all_projects(self):
        return (
            self.db.query(Project)
            .filter(Project.is_active == True)
            .all()
        )

    def get_project_by_id(self, project_id: int):
        return (
            self.db.query(Project)
            .filter(
                Project.id == project_id,
                Project.is_active == True
            )
            .first()
        )

    def create_project(self, project: ProjectCreate):
        db_project = Project(**project.model_dump())

        self.db.add(db_project)
        self.db.commit()
        self.db.refresh(db_project)

        return db_project

    def update_project(self, db_project: Project, project: ProjectUpdate):
        update_data = project.model_dump(exclude_unset=True)

        for key, value in update_data.items():
            setattr(db_project, key, value)

        self.db.commit()
        self.db.refresh(db_project)

        return db_project

    def delete_project(self, db_project: Project):
        db_project.is_active = False
        self.db.commit()
        return db_project

    def get_projects_by_client(self, client_id: int):
        return (
            self.db.query(Project)
            .filter(
                Project.client_id == client_id,
                Project.is_active == True
            )
            .all()
        )

    # ==============================
    # Project Team
    # ==============================

    def get_project_team(self, project_id: int):
        return (
            self.db.query(User)
            .join(
                ProjectMember,
                User.id == ProjectMember.user_id
            )
            .filter(
                ProjectMember.project_id == project_id,
                User.is_active == True
            )
            .all()
        )

    def assign_employee(
        self,
        project_id: int,
        user_id: int,
        assigned_by: int
    ):

        existing = (
            self.db.query(ProjectMember)
            .filter(
                ProjectMember.project_id == project_id,
                ProjectMember.user_id == user_id
            )
            .first()
        )

        if existing:
            return existing

        member = ProjectMember(
            project_id=project_id,
            user_id=user_id,
            assigned_by=assigned_by
        )

        self.db.add(member)
        self.db.commit()
        self.db.refresh(member)

        return member

    def remove_employee(
        self,
        project_id: int,
        user_id: int
    ):

        member = (
            self.db.query(ProjectMember)
            .filter(
                ProjectMember.project_id == project_id,
                ProjectMember.user_id == user_id
            )
            .first()
        )

        if not member:
            return None

        self.db.delete(member)
        self.db.commit()

        return True
    
    
    def get_project_timeline(self, 
            project_id: int):
            project = (
            self.db.query(Project)
            .filter(
                Project.id == project_id,
                Project.is_active == True
            )
            .first()
        )
            if not project:
                return None
            modules = (
                self.db.query(Module)
            .filter(
                Module.project_id == project_id,
                Module.is_active == True
            )
            .order_by(Module.start_date)
            .all()
        )
            module_ids = [module.id for module in modules]
            tasks = []
            if module_ids:
                   tasks = (
                self.db.query(Task)
                .filter(
                    Task.module_id.in_(module_ids),
                    Task.is_active == True
                )
                .order_by(Task.start_date)
                .all()
            )
                   return {
            "project": project,
            "modules": modules,
            "tasks": tasks
        }