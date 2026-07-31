from app.repositories.file_repository import FileRepository
from app.schemas.file import FileCreate, FileUpdate


class FileService:

    def __init__(self, repository: FileRepository):
        self.repository = repository

    def get_all_files(self):
        return self.repository.get_all_files()

    def get_files_by_module(self, module_id: int):
        return self.repository.get_files_by_module(module_id)
    def get_files_by_project(self, project_id: int): 
        return self.repository.get_files_by_project(project_id)

    def get_file_by_id(self, file_id: int):
        return self.repository.get_file_by_id(file_id)

    def create_file(self, file: FileCreate):
        return self.repository.create_file(file)

    def update_file(self, db_file, file: FileUpdate):
        return self.repository.update_file(db_file, file)

    def delete_file(self, db_file):
        return self.repository.delete_file(db_file)