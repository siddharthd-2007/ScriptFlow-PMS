from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.connection import get_db

from app.schemas.employee import (
    EmployeeCreate,
    EmployeeUpdate,
    EmployeeResponse,
)

from app.services.employee_service import EmployeeService

from app.api.dependencies import (
    require_admin,
    require_employee,
)

router = APIRouter(
    prefix="/employees",
    tags=["Employees"]
)


@router.get(
    "/",
    response_model=list[EmployeeResponse]
)
def get_all_employees(
    db: Session = Depends(get_db),
    current_user=Depends(require_employee)
):
    return EmployeeService.get_all(db)


@router.get(
    "/{employee_id}",
    response_model=EmployeeResponse
)
def get_employee(
    employee_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_employee)
):
    employee = EmployeeService.get_by_id(
        db,
        employee_id
    )

    if employee is None:
        raise HTTPException(
            status_code=404,
            detail="Employee not found"
        )

    return employee


@router.post(
    "/",
    response_model=EmployeeResponse,
    status_code=status.HTTP_201_CREATED
)
def create_employee(
    employee: EmployeeCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin)
):

    new_employee = EmployeeService.create(
        db,
        employee
    )

    if new_employee is None:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    return new_employee


@router.put(
    "/{employee_id}",
    response_model=EmployeeResponse
)
def update_employee(
    employee_id: int,
    employee_data: EmployeeUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin)
):

    employee = EmployeeService.get_by_id(
        db,
        employee_id
    )

    if employee is None:
        raise HTTPException(
            status_code=404,
            detail="Employee not found"
        )

    return EmployeeService.update(
        db,
        employee,
        employee_data
    )


@router.delete("/{employee_id}")
def deactivate_employee(
    employee_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin)
):

    employee = EmployeeService.get_by_id(
        db,
        employee_id
    )

    if employee is None:
        raise HTTPException(
            status_code=404,
            detail="Employee not found"
        )

    EmployeeService.deactivate(
        db,
        employee
    )

    return {
        "message": "Employee deactivated successfully"
    }