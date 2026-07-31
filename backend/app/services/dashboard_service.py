from app.repositories.dashboard_repository import DashboardRepository
from app.schemas.dashboard import (
    DashboardStats,
    AttentionProject,
    RecentClient,
    UpcomingDeadline,
    EmployeeWorkload,
    DashboardResponse
)


class DashboardService:

    def __init__(self, repository: DashboardRepository):
        self.repository = repository

    def get_dashboard(self) -> DashboardResponse:

        data = self.repository.get_dashboard_data()

        return DashboardResponse(

            stats=DashboardStats(**data["stats"]),

            attention_projects=[
                AttentionProject(**item)
                for item in data["attention_projects"]
            ],

            recent_clients=[
                RecentClient(**item)
                for item in data["recent_clients"]
            ],

            upcoming_deadlines=[
                UpcomingDeadline(**item)
                for item in data["upcoming_deadlines"]
            ],

            employee_workload=[
                EmployeeWorkload(**item)
                for item in data["employee_workload"]
            ]

        )