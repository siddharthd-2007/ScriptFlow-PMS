from sqlalchemy.orm import Session

from app.models.file import File
from app.schemas.file import FileCreate, FileUpdate
from app.models.module import Module

class FileRepository:

    def __init__(self, db: Session):
        self.db = db

    def get_all_files(self):
        return (
            self.db.query(File)
            .all()
        )

    def get_files_by_module(self, module_id: int):
        return (
            self.db.query(File)
            .filter(
                File.module_id == module_id
            )
            .all()
        )
        
    def get_files_by_project(self, project_id: int):
        return (
        self.db.query(File)
        .join(
            Module,
            File.module_id == Module.id
        )
        .filter(
            Module.project_id == project_id
        )
        .all()
    )    

    def get_file_by_id(self, file_id: int):
        return (
            self.db.query(File)
            .filter(
                File.id == file_id
            )
            .first()
        )

    def create_file(self, file: FileCreate):

        db_file = File(**file.model_dump())

        self.db.add(db_file)
        self.db.commit()
        self.db.refresh(db_file)

        return db_file

    def update_file(self, db_file: File, file: FileUpdate):

        update_data = file.model_dump(exclude_unset=True)

        for key, value in update_data.items():
            setattr(db_file, key, value)

        self.db.commit()
        self.db.refresh(db_file)

        return db_file

    def delete_file(self, db_file: File):

        self.db.delete(db_file)

        self.db.commit()

        return db_file