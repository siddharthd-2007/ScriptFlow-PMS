from app.repositories.settings_repository import SettingsRepository


class SettingsService:

    def __init__(self, repository: SettingsRepository):
        self.repository = repository

    def get_settings(self):
        return self.repository.get_settings()

    def update_settings(self, data: dict):
        return self.repository.update_settings(data)