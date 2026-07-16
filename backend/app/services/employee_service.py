from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.employee import EmployeeCreate, EmployeeUpdate
from app.repositories.employee_repository import EmployeeRepository
from app.core.security import hash_password


class EmployeeService:

    @staticmethod
    def get_all(db: Session):
        return EmployeeRepository.get_all(db)

    @staticmethod
    def get_by_id(db: Session, employee_id: int):
        return EmployeeRepository.get_by_id(db, employee_id)

    @staticmethod
    def create(db: Session, employee_data: EmployeeCreate):

        existing = EmployeeRepository.get_by_email(
            db,
            employee_data.email
        )

        if existing:
            return None

        employee = User(
            full_name=employee_data.full_name,
            email=employee_data.email,
            password=hash_password(employee_data.password),
            role=employee_data.role,
            department=employee_data.department,
            employee_code=employee_data.employee_code,
            phone=employee_data.phone,
            designation=employee_data.designation,
            joining_date=employee_data.joining_date,
        )

        return EmployeeRepository.create(
            db,
            employee
        )

    @staticmethod
    def update(
        db: Session,
        employee: User,
        employee_data: EmployeeUpdate
    ):

        update_data = employee_data.model_dump(
            exclude_unset=True
        )

        for key, value in update_data.items():
            setattr(employee, key, value)

        return EmployeeRepository.update(
            db,
            employee
        )

    @staticmethod
    def deactivate(
        db: Session,
        employee: User
    ):
        return EmployeeRepository.deactivate(
            db,
            employee
        )