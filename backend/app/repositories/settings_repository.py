from sqlalchemy.orm import Session

from app.models.settings import Settings


class SettingsRepository:

    def __init__(self, db: Session):
        self.db = db

    def get_settings(self):

        settings = self.db.query(Settings).first()

        if not settings:

            settings = Settings()

            self.db.add(settings)

            self.db.commit()

            self.db.refresh(settings)

        return settings

    def update_settings(self, data: dict):

        settings = self.get_settings()

        for key, value in data.items():

            setattr(settings, key, value)

        self.db.commit()

        self.db.refresh(settings)

        return settings