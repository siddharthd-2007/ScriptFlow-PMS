from sqlalchemy.orm import Session

from app.models.task import Task
from app.schemas.task import TaskCreate, TaskUpdate


class TaskRepository:

    def __init__(self, db: Session):
        self.db = db

    def get_all_tasks(self):
        return (
            self.db.query(Task)
            .filter(Task.is_active == True)
            .all()
        )

    def get_task_by_id(self, task_id: int):
        return (
            self.db.query(Task)
            .filter(
                Task.id == task_id,
                Task.is_active == True
            )
            .first()
        )

    def create_task(self, task: TaskCreate):

        db_task = Task(**task.model_dump())

        self.db.add(db_task)
        self.db.commit()
        self.db.refresh(db_task)

        return db_task

    def update_task(self, db_task: Task, task: TaskUpdate):

        update_data = task.model_dump(exclude_unset=True)

        for key, value in update_data.items():
            setattr(db_task, key, value)

        self.db.commit()
        self.db.refresh(db_task)

        return db_task

    def delete_task(self, db_task: Task):

        db_task.is_active = False

        self.db.commit()

        return db_task