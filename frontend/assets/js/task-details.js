/* ==========================================
   ScriptFlow PMS
   Task Details
========================================== */
loadSidebar("tasks.html"); 


const params = new URLSearchParams(window.location.search);
console.log(window.location.href);
console.log(params.get("id"));

const taskId = params.get("id");

if (!taskId) {

    alert("Invalid Task.");

    window.location.href = "tasks.html";

}

let task = null;
let module = null;
let project = null;
let employee = null;

/* ==========================================
   Helpers
========================================== */

function getProgress(task) {

    if (task.status === "Completed") {
        return 100;
    }

    if (!task.estimated_hours || task.estimated_hours === 0) {
        return 0;
    }

    return Math.min(
        Math.round(
            (task.actual_hours / task.estimated_hours) * 100
        ),
        100
    );

}

function daysRemaining(dueDate) {

    if (!dueDate) {
        return "-";
    }

    const today = new Date();

    const due = new Date(dueDate);

    const diff = due - today;

    return Math.max(
        Math.ceil(diff / (1000 * 60 * 60 * 24)),
        0
    );

}

function formatDate(date) {

    if (!date) return "-";

    return new Date(date).toLocaleDateString(
        "en-GB",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}

function setText(id, value) {

    const element = document.getElementById(id);

    if (!element) return;

    element.textContent = value;

}
/* ==========================================
   UI
========================================== */

function populateTask() {

    setText(
        "pageTaskTitle",
        task.title
    );

    setText(
    "breadcrumbProject",
    project ? project.name : "-"
    );

    setText(
    "breadcrumbModule",
    module ? module.name : "-"
    );

    setText(
    "breadcrumbTask",
    task.title
    );

    setText(
        "taskTitle",
        task.title
    );

    setText(
        "taskDescription",
        task.description || "No description available."
    );

    const statusBadge = document.getElementById("taskStatus");
    
    if (statusBadge) {

    statusBadge.textContent = task.status;

    statusBadge.className =
        `badge ${getStatusBadge(task.status)} rounded-pill px-3 py-2`;
        }

    const priorityBadge = document.getElementById("taskPriority");

    if (priorityBadge) {

    priorityBadge.textContent = task.priority;

    priorityBadge.className =
        `badge ${getPriorityBadge(task.priority)} rounded-pill px-3 py-2`;
    }

    setText(
        "taskProject",
        project ? project.name : "-"
    );

    setText(
    "taskModule",
    module ? module.name : "-"
    );

    setText(
        "taskAssignedTo",
        employee
            ? employee.full_name
            : "Unassigned"
    );

    setText(
    "taskStartDate",
    formatDate(task.start_date)
    );

    setText(
    "taskDueDate",
    formatDate(task.due_date)
    );

    setText(
    "taskCreatedAt",
    formatDate(task.created_at)
    );

    setText(
    "taskUpdatedAt",
    formatDate(task.updated_at)
    );

    const progress = getProgress(task);

    setText(
        "taskProgress",
        `${progress}%`
    );

    setText(
        "taskProgressText",
        `${progress}% Completed`
    );

    const progressBar =
        document.getElementById("taskProgressBar");

    if (progressBar) {

        progressBar.style.width =
            `${progress}%`;

        progressBar.setAttribute(
            "aria-valuenow",
            progress
        );

    }

    setText(
        "estimatedHours",
        task.estimated_hours
    );

    setText(
        "actualHours",
        task.actual_hours
    );

    setText(
        "daysRemaining",
        daysRemaining(task.due_date)
    );

}

function getStatusBadge(status) {

    switch (status) {

        case "Completed":
            return "bg-success";

        case "In Progress":
            return "bg-primary";

        case "Testing":
            return "bg-warning text-dark";

        case "Blocked":
            return "bg-danger";

        default:
            return "bg-secondary";
    }

}

function getPriorityBadge(priority) {

    switch (priority) {

        case "High":
            return "bg-danger";

        case "Medium":
            return "bg-warning text-dark";

        case "Low":
            return "bg-success";

        default:
            return "bg-secondary";
    }

}

/* ==========================================
   Load Task
========================================== */

async function loadTaskDetails() {

    try {

        task = await apiRequest(
    `/tasks/${taskId}`
);

module = await apiRequest(
    `/modules/${task.module_id}`
);

project = await apiRequest(
    `/projects/${module.project_id}`
);

        if (task.assigned_to) {

            employee = await apiRequest(
                `/employees/${task.assigned_to}`
            );

        }

        populateTask();

    }

    catch (error) {

        console.error("Task Details Error:", error);

        alert("Unable to load task details.");

        window.location.href = "tasks.html";

    }

}

/* ==========================================
   Buttons
========================================== */

const editTaskBtn =
    document.getElementById("editTaskBtn");

if (editTaskBtn) {

    editTaskBtn.addEventListener("click", () => {

        if (!task) return;

        window.location.href =
            `tasks.html?edit=${task.id}`;

    });

}

/* ==========================================
   Initialize
========================================== */

loadTaskDetails();