from app.repositories.task_repository import TaskRepository
from app.schemas.task import TaskCreate, TaskUpdate


class TaskService:

    def __init__(self, repository: TaskRepository):
        self.repository = repository

    def get_all_tasks(self):
        return self.repository.get_all_tasks()

    def get_task_by_id(self, task_id: int):
        return self.repository.get_task_by_id(task_id)

    def create_task(self, task: TaskCreate):
        return self.repository.create_task(task)

    def update_task(self, db_task, task: TaskUpdate):
        return self.repository.update_task(db_task, task)

    def delete_task(self, db_task):
        return self.repository.delete_task(db_task)
    
    def get_tasks_by_module(self, module_id: int):
        return self.repository.get_tasks_by_module(module_id)