from sqlalchemy.orm import Session

from app.models.project import Project
from app.schemas.project import ProjectCreate, ProjectUpdate


class ProjectRepository:

    def __init__(self, db: Session):
        self.db = db

    def get_all_projects(self):
        return (
            self.db.query(Project)
            .filter(Project.is_active == True)
            .all()
        )

    def get_project_by_id(self, project_id: int):
        return (
            self.db.query(Project)
            .filter(
                Project.id == project_id,
                Project.is_active == True
            )
            .first()
        )

    def create_project(self, project: ProjectCreate):
        db_project = Project(**project.model_dump())

        self.db.add(db_project)
        self.db.commit()
        self.db.refresh(db_project)

        return db_project

    def update_project(self, db_project: Project, project: ProjectUpdate):
        update_data = project.model_dump(exclude_unset=True)

        for key, value in update_data.items():
            setattr(db_project, key, value)

        self.db.commit()
        self.db.refresh(db_project)

        return db_project
    
    def delete_project(self, db_project: Project):
        db_project.is_active = False
        self.db.commit()
        return db_project
    
    def get_projects_by_client(self, client_id: int):
        return (
        self.db.query(Project)
        .filter(
            Project.client_id == client_id,
            Project.is_active == True
        )
        .all()
    )