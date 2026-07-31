from pydantic import BaseModel
from typing import List


# ==========================================
# Dashboard Statistics
# ==========================================

class DashboardStats(BaseModel):
    total_projects: int
    active_projects: int
    delayed_projects: int
    total_clients: int
    total_employees: int
    total_tasks: int


# ==========================================
# Projects Requiring Attention
# ==========================================

class AttentionProject(BaseModel):
    id: int
    name: str
    client: str
    manager: str
    status: str
    priority: str
    progress: int
    deadline: str


# ==========================================
# Recently Added Clients
# ==========================================

class RecentClient(BaseModel):
    id: int
    company: str
    industry: str
    projects: int
    status: str


# ==========================================
# Upcoming Deadlines
# ==========================================

class UpcomingDeadline(BaseModel):
    id: int
    project: str
    stage: str
    deadline: str


# ==========================================
# Employee Workload
# ==========================================

class EmployeeWorkload(BaseModel):
    id: int
    employee: str
    workload: int


# ==========================================
# Dashboard Response
# ==========================================

class DashboardResponse(BaseModel):
    stats: DashboardStats
    attention_projects: List[AttentionProject]
    recent_clients: List[RecentClient]
    upcoming_deadlines: List[UpcomingDeadline]
    employee_workload: List[EmployeeWorkload]