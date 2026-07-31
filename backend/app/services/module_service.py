from app.models.module import Module
from app.repositories.module_repository import ModuleRepository
from app.schemas.module import ModuleCreate, ModuleUpdate


class ModuleService:

    def __init__(self, repository: ModuleRepository):
        self.repository = repository

    def get_all_modules(self):
        return self.repository.get_all_modules()

    def get_module_by_id(self, module_id: int):
        return self.repository.get_module_by_id(module_id)

    def get_modules_by_project(self, project_id: int):
        return self.repository.get_modules_by_project(project_id)

    def create_module(self, module: ModuleCreate):
        return self.repository.create_module(module)

    def update_module(
        self,
        db_module: Module,
        module: ModuleUpdate
    ):
        return self.repository.update_module(db_module, module)

    def delete_module(self, db_module: Module):
        return self.repository.delete_module(db_module)