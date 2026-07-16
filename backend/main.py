from fastapi import FastAPI
from app.api.auth import router as auth_router

from fastapi.middleware.cors import CORSMiddleware
from app.api.employee import router as employee_router

from app.api.client_api import router as client_router

from app.api.project_api import router as project_router

from app.api import task_api

from app.api import calendar_api

# Create the FastAPI application
app = FastAPI(
    title="Project Management System API",
    description="Backend API for a Software Development Project Management System",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(employee_router)
app.include_router(client_router)

# Root endpoint
@app.get("/")
def home():
    return {
        "status": "success",
        "message": "Welcome to Project Management System API",
        "version": "1.0.0"
    }


# Health check endpoint
@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }


# Get all projects
@app.get("/projects")
def get_projects():
    return {
        "projects": [
            {
                "id": 1,
                "name": "Website Development",
                "status": "In Progress"
            },
            {
                "id": 2,
                "name": "Mobile Application",
                "status": "Completed"
            }
        ]
    }


# Create a new project
@app.post("/projects")
def create_project():
    return {
        "status": "success",
        "message": "Project created successfully"
    }

app.include_router(project_router)

app.include_router(task_api.router)

app.include_router(calendar_api.router)