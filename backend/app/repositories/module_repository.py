from sqlalchemy.orm import Session

from app.models.module import Module
from app.schemas.module import ModuleCreate, ModuleUpdate


class ModuleRepository:

    def __init__(self, db: Session):
        self.db = db

    def get_all_modules(self):
        return (
            self.db.query(Module)
            .filter(Module.is_active == True)
            .all()
        )

    def get_module_by_id(self, module_id: int):
        return (
            self.db.query(Module)
            .filter(
                Module.id == module_id,
                Module.is_active == True
            )
            .first()
        )

    def get_modules_by_project(self, project_id: int):
        return (
            self.db.query(Module)
            .filter(
                Module.project_id == project_id,
                Module.is_active == True
            )
            .all()
        )

    def create_module(self, module: ModuleCreate):
        db_module = Module(**module.model_dump())

        self.db.add(db_module)
        self.db.commit()
        self.db.refresh(db_module)

        return db_module

    def update_module(
        self,
        db_module: Module,
        module: ModuleUpdate
    ):
        update_data = module.model_dump(exclude_unset=True)

        for key, value in update_data.items():
            setattr(db_module, key, value)

        self.db.commit()
        self.db.refresh(db_module)

        return db_module

    def delete_module(self, db_module: Module):
        db_module.is_active = False
        self.db.commit()

        return db_module