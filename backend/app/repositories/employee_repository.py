from sqlalchemy.orm import Session

from app.models.user import User
from app.models.task import Task
from app.models.project_member import ProjectMember
from app.models.project import Project


class EmployeeRepository:

    @staticmethod
    def get_all(db: Session):
        return db.query(User).all()

    @staticmethod
    def get_by_id(db: Session, employee_id: int):
        return (
            db.query(User)
            .filter(User.id == employee_id)
            .first()
        )

    @staticmethod
    def get_by_email(db: Session, email: str):
        return (
            db.query(User)
            .filter(User.email == email)
            .first()
        )

    @staticmethod
    def create(db: Session, employee: User):
        db.add(employee)
        db.commit()
        db.refresh(employee)
        return employee

    @staticmethod
    def update(db: Session, employee: User):
        db.commit()
        db.refresh(employee)
        return employee

    @staticmethod
    def deactivate(db: Session, employee: User):
        employee.is_active = False
        db.commit()
        db.refresh(employee)
        return employee

    @staticmethod
    def get_employee_tasks(
        db: Session,
        employee_id: int
    ):
        return (
            db.query(Task)
            .filter(
                Task.assigned_to == employee_id,
                Task.is_active == True
            )
            .all()
        )

    @staticmethod
    def get_employee_projects(
        db: Session,
        employee_id: int
    ):
        return (
            db.query(Project)
            .join(
                ProjectMember,
                Project.id == ProjectMember.project_id
            )
            .filter(
                ProjectMember.user_id == employee_id,
                Project.is_active == True
            )
            .all()
        )