/* ==========================================================
                    TASKS
========================================================== */

// ==========================================================
// DOM ELEMENTS
// ==========================================================

const tasksTableBody = document.getElementById("tasksTableBody");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const progressTasks = document.getElementById("progressTasks");
const overdueTasks = document.getElementById("overdueTasks");

const taskSearch = document.getElementById("taskSearch");
const statusFilter = document.getElementById("statusFilter");
const resetFilters = document.getElementById("resetFilters");
const priorityFilter = document.getElementById("priorityFilter");
const newTaskBtn = document.getElementById("newTaskBtn");

// ==========================================================
// GLOBAL VARIABLES
// ==========================================================
let taskModal;

let editingTaskId = null;

let isEditMode = false;
let tasks = [];
let filteredTasks = [];

let projects = [];
let modules = [];
let employees = [];

// ==========================================================
// LOOKUP MAPS
// ==========================================================

let moduleMap = {};
let employeeMap = {};

// ==========================================================
// INITIALIZATION
// ==========================================================

document.addEventListener("DOMContentLoaded", async () => {

    loadSidebar("tasks.html");

    initializeTopbar({
    page: "Tasks",
    subtitle: "Manage and track all project tasks.",
    showSearch: false,
    showNewButton: true,
    newButtonText: "New Task",
    newButtonId: "newTaskBtn"
});

    await initializePage();

});

// ==========================================================
// INITIALIZE PAGE
// ==========================================================

async function initializePage() {

    taskModal = new bootstrap.Modal(
    document.getElementById("taskModal")
);

document
    .getElementById("taskModal")
    .addEventListener("hidden.bs.modal", () => {

        isEditMode = false;

        editingTaskId = null;

        document.getElementById("taskForm").reset();

        document.getElementById("taskModalTitle").textContent =
            "Create New Task";

        document.getElementById("saveTaskBtn").innerHTML = `
            <i class="bi bi-check-lg me-2"></i>
            Create Task
        `;

    });

        document
        .getElementById("newTaskBtn")
        ?.addEventListener("click", () => {

        isEditMode = false;

        editingTaskId = null;

        document.getElementById("taskForm").reset();

        document.getElementById("taskModalTitle").textContent =
            "Create New Task";

        document.getElementById("saveTaskBtn").innerHTML = `
            <i class="bi bi-check-lg me-2"></i>
            Create Task
        `;

        taskModal.show();

    });

document
    .getElementById("saveTaskBtn")
    ?.addEventListener("click", () => {

        if (isEditMode) {

            updateTask();

        }

        else {

            createTask();

        }

    });  

    showLoading();

    try {

        await Promise.all([
            loadTasks(),
            loadModules(),
            loadEmployees()
        ]);

        createLookupMaps();
        updateStatistics();
        renderTasks();
        attachFilterEvents();

    }

    catch (error) {

        console.error(error);

        showError("Failed to load tasks.");

    }

}
/* ==========================================================
                    LOAD TASKS
========================================================== */

async function loadTasks() {

    tasks = await apiRequest("/tasks/");

    filteredTasks = [...tasks];

}

async function loadModules() {

    modules = await apiRequest("/modules/");

    console.log("Modules:", modules);

    populateModuleDropdown();

}

async function loadEmployees() {

    employees = await apiRequest("/employees/");

    console.log("Employees:", employees);

    populateEmployeeDropdown();

}

function createLookupMaps() {

    moduleMap = {};

    employeeMap = {};

    modules.forEach(module => {

        moduleMap[module.id] = module.name;

    });

    employees.forEach(employee => {

        employeeMap[employee.id] = employee.full_name;

    });

}
/* ==========================================================
                    LOADING
========================================================== */

function showLoading() {

    tasksTableBody.innerHTML = `
        <tr>

            <td colspan="8" class="text-center py-5">

                <div class="spinner-border"></div>

                <div class="mt-3">
                    Loading Tasks...
                </div>

            </td>

        </tr>
    `;

}

/* ==========================================================
                    ERROR
========================================================== */

function showError(message) {

    tasksTableBody.innerHTML = `
        <tr>

            <td colspan="8"
                class="text-center text-danger py-5">

                ${message}

            </td>

        </tr>
    `;

}

/* ==========================================================
                    RENDER TASKS
========================================================== */

function renderTasks() {

    console.log(filteredTasks);

    tasksTableBody.innerHTML = "";

    if (!filteredTasks.length) {

        tasksTableBody.innerHTML = `
            <tr>

                <td colspan="8" class="text-center py-5">

                    <i class="bi bi-list-task display-5 text-muted"></i>

                    <h5 class="mt-3">
                        No Tasks Found
                    </h5>

                    <p class="text-muted mb-0">
                        Create your first task to get started.
                    </p>

                </td>

            </tr>
        `;

        return;

    }

    filteredTasks.forEach(task => {

        tasksTableBody.innerHTML += `

            <tr>

    <td>

        <div class="fw-semibold">

    <a
        href="task-details.html?id=${task.id}"
        class="text-decoration-none text-dark">

        ${task.title}

    </a>

</div>

        <small class="text-muted">

            ${task.description || ""}

        </small>

    </td>

    <td>

        ${moduleMap[task.module_id] || "-"}

    </td>

    <td>

        ${employeeMap[task.assigned_to] || "Unassigned"}

    </td>
    <td>
    
        ${renderStatusBadge(task.status)}

    </td>

                <td>

                    ${renderPriorityBadge(task.priority)}

                </td>

                <td>

                    ${formatDate(task.due_date)}

                </td>

                <td>

    <div class="d-flex gap-2 justify-content-center">

        <a
            href="task-details.html?id=${task.id}"
            class="btn btn-sm btn-outline-secondary"
            title="View Task">

            <i class="bi bi-eye"></i>

        </a>

        <button
            class="btn btn-sm btn-outline-primary edit-task"
            data-id="${task.id}"
            title="Edit Task">

            <i class="bi bi-pencil"></i>

        </button>

        <button
            class="btn btn-sm btn-outline-danger delete-task"
            data-id="${task.id}"
            title="Delete Task">

            <i class="bi bi-trash"></i>

        </button>

    </div>

</td>

            </tr>

        `;

    });

    attachTaskEvents();

}

// ==========================================================
// ATTACH TASK EVENTS
// ==========================================================

function attachTaskEvents() {

    document.querySelectorAll(".edit-task").forEach(button => {

        button.addEventListener("click", () => {

            openEditTask(button.dataset.id);

        });

    });

    document.querySelectorAll(".delete-task").forEach(button => {

        button.addEventListener("click", () => {

            deleteTask(button.dataset.id);

        });

    });

}

// ==========================================================
// FILTER EVENTS
// ==========================================================

function attachFilterEvents() {

    taskSearch.addEventListener("input", applyFilters);

    statusFilter.addEventListener("change", applyFilters);

    priorityFilter.addEventListener("change", applyFilters);

    resetFilters.addEventListener("click", resetTaskFilters);

}

// ==========================================================
// APPLY FILTERS
// ==========================================================

function applyFilters() {

    const search = taskSearch.value.toLowerCase().trim();

    const status = statusFilter.value.toLowerCase();

    const priority = priorityFilter.value.toLowerCase();

    filteredTasks = tasks.filter(task => {

        const matchesSearch =

            task.title.toLowerCase().includes(search) ||

            (task.description || "")
                .toLowerCase()
                .includes(search);

        const matchesStatus =

            !status ||

            (task.status || "")
                .toLowerCase() === status;

        const matchesPriority =

            !priority ||

            (task.priority || "")
                .toLowerCase() === priority;

        return (

            matchesSearch &&

            matchesStatus &&

            matchesPriority

        );

    });

    renderTasks();

}
// ==========================================================
// RESET TASK FILTERS
// ==========================================================

function resetTaskFilters() {

    taskSearch.value = "";

    statusFilter.value = "";

    priorityFilter.value = "";

    filteredTasks = [...tasks];

    renderTasks();

}
// ==========================================================
// OPEN EDIT TASK
// ==========================================================

function openEditTask(taskId) {

    const task = tasks.find(t => t.id == taskId);

    if (!task) return;

    editingTaskId = task.id;

    isEditMode = true;

    document.getElementById("taskTitle").value =
        task.title || "";

    document.getElementById("taskDescription").value =
        task.description || "";

    document.getElementById("taskModule").value =
        task.module_id || "";

    document.getElementById("taskAssignee").value =
        task.assigned_to || "";

    document.getElementById("taskPriority").value =
        task.priority || "";

    document.getElementById("taskStatus").value =
        task.status || "";

    document.getElementById("taskStartDate").value =
        task.start_date
            ? task.start_date.substring(0, 10)
            : "";

    document.getElementById("taskDueDate").value =
        task.due_date
            ? task.due_date.substring(0, 10)
            : "";

    document.getElementById("taskEstimatedHours").value =
        task.estimated_hours || "";

    document.getElementById("taskModalTitle").textContent = "Edit Task";

    document.getElementById("saveTaskBtn").innerHTML = `
    <i class="bi bi-check-lg me-2"></i>
    Update Task
`;    

    taskModal.show();

}

/* ==========================================================
                    STATISTICS
========================================================== */

function updateStatistics() {

    totalTasks.textContent = tasks.length;

    completedTasks.textContent = tasks.filter(task =>
        (task.status || "").toLowerCase() === "completed"
    ).length;

    progressTasks.textContent = tasks.filter(task =>
        (task.status || "").toLowerCase() === "in progress"
    ).length;

    const today = new Date();

    overdueTasks.textContent = tasks.filter(task => {

        if (!task.due_date)
            return false;

        return (
            new Date(task.due_date) < today &&
            (task.status || "").toLowerCase() !== "completed"
        );

    }).length;

}

// ==========================================================
// CREATE TASK
// ==========================================================

async function createTask() {

    const taskData = {

        title: document.getElementById("taskTitle").value.trim(),

        description: document.getElementById("taskDescription").value.trim(),

        module_id: Number(
            document.getElementById("taskModule").value
        ),

        assigned_to:
            document.getElementById("taskAssignee").value || null,

        priority:
            document.getElementById("taskPriority").value,

        status:
            document.getElementById("taskStatus").value,

        start_date:
            document.getElementById("taskStartDate").value || null,

        due_date:
            document.getElementById("taskDueDate").value || null,

        estimated_hours:
            Number(
                document.getElementById("taskEstimatedHours").value
            ),

        actual_hours: 0

    };

    // Validation

    if (!taskData.title) {

        alert("Please enter a task title.");

        return;

    }

    if (!taskData.module_id) {

        alert("Please select a module.");

        return;

    }

    try {

        await apiRequest(
            "/tasks/",
            "POST",
            taskData
        );

        taskModal.hide();

        document.getElementById("taskForm").reset();

        await loadTasks();

        updateStatistics();

        renderTasks();

    }

    catch (error) {

        console.error(error);

        alert("Failed to create task.");

    }

}

// ==========================================================
// UPDATE TASK
// ==========================================================

async function updateTask() {

    const taskData = {

        title: document.getElementById("taskTitle").value.trim(),

        description: document.getElementById("taskDescription").value.trim(),

        module_id: Number(
            document.getElementById("taskModule").value
        ),

        assigned_to:
            document.getElementById("taskAssignee").value || null,

        priority:
            document.getElementById("taskPriority").value,

        status:
            document.getElementById("taskStatus").value,

        start_date:
            document.getElementById("taskStartDate").value || null,

        due_date:
            document.getElementById("taskDueDate").value || null,

        estimated_hours:
            Number(
                document.getElementById("taskEstimatedHours").value
            ),

        actual_hours: 0

    };

    try {

        await apiRequest(

            `/tasks/${editingTaskId}`,

            "PUT",

            taskData

        );

        taskModal.hide();

        document.getElementById("taskForm").reset();

        editingTaskId = null;

        isEditMode = false;

        await loadTasks();

        updateStatistics();

        renderTasks();

    }

    catch (error) {

        console.error(error);

        alert("Failed to update task.");

    }

}

// ==========================================================
// DELETE TASK
// ==========================================================

async function deleteTask(taskId) {

    const confirmed = confirm(
        "Are you sure you want to delete this task?"
    );

    if (!confirmed) {
        return;
    }

    try {

        await apiRequest(
            `/tasks/${taskId}`,
            "DELETE"
        );

        await loadTasks();

        updateStatistics();

        renderTasks();

    }

    catch (error) {

        console.error(error);

        alert("Failed to delete task.");

    }

}

/* ==========================================================
                    HELPERS
========================================================== */

// ==========================================================
// POPULATE MODULE DROPDOWN
// ==========================================================

function populateModuleDropdown() {

    const select = document.getElementById("taskModule");

    select.innerHTML = `
        <option value="">
            Select Module
        </option>
    `;

    modules.forEach(module => {

        select.innerHTML += `
            <option value="${module.id}">
                ${module.name}
            </option>
        `;

    });

}

// ==========================================================
// POPULATE EMPLOYEE DROPDOWN
// ==========================================================

function populateEmployeeDropdown() {

    const select = document.getElementById("taskAssignee");

    select.innerHTML = `
        <option value="">
            Unassigned
        </option>
    `;

    employees.forEach(employee => {

        select.innerHTML += `
            <option value="${employee.id}">
                ${employee.full_name}
            </option>
        `;

    });

}

function formatDate(date) {

    if (!date)
        return "-";

    return new Date(date).toLocaleDateString("en-IN");

}

function renderStatusBadge(status) {

    const value = (status || "").toLowerCase();

    let cls = "bg-secondary";

    if (value === "completed")
        cls = "bg-success";

    else if (value === "in progress")
        cls = "bg-primary";

    else if (value === "review")
        cls = "bg-warning text-dark";

    else if (value === "blocked")
        cls = "bg-danger";

    return `
        <span class="badge ${cls}">
            ${status || "-"}
        </span>
    `;

}

function renderPriorityBadge(priority) {

    const value = (priority || "").toLowerCase();

    let cls = "bg-secondary";

    if (value === "critical")
        cls = "bg-danger";

    else if (value === "high")
        cls = "bg-warning text-dark";

    else if (value === "medium")
        cls = "bg-info text-dark";

    else if (value === "low")
        cls = "bg-success";

    return `
        <span class="badge ${cls}">
            ${priority || "-"}
        </span>
    `;

}
