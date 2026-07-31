from app.repositories.report_repository import ReportRepository


class ReportService:

    def __init__(self, repository: ReportRepository):
        self.repository = repository

    def get_dashboard_stats(self):
        return self.repository.get_dashboard_stats()

    def get_task_status_summary(self):
        return self.repository.get_task_status_summary()

    def get_top_performers(self):
        return self.repository.get_top_performers()