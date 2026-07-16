from app.models.project import Project
from app.repositories.project_repository import ProjectRepository
from app.schemas.project import ProjectCreate, ProjectUpdate


class ProjectService:

    def __init__(self, repository: ProjectRepository):
        self.repository = repository

    def get_all_projects(self):
        return self.repository.get_all_projects()

    def get_project_by_id(self, project_id: int):
        return self.repository.get_project_by_id(project_id)

    def create_project(self, project: ProjectCreate):
        return self.repository.create_project(project)

    def update_project(self, db_project: Project, project: ProjectUpdate):
        return self.repository.update_project(db_project, project)

    def delete_project(self, db_project: Project):
        return self.repository.delete_project(db_project)
    
    def get_projects_by_client(self, client_id: int):
        return self.repository.get_projects_by_client(client_id)