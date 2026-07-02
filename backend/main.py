from fastapi import FastAPI

# Create the FastAPI application
app = FastAPI(
    title="Project Management System API",
    description="Backend API for a Software Development Project Management System",
    version="1.0.0"
)


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