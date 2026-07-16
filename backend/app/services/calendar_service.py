from app.repositories.calendar_repository import CalendarRepository


class CalendarService:

    def __init__(self, repository: CalendarRepository):
        self.repository = repository

    def get_calendar_tasks(self):
        return self.repository.get_calendar_tasks()