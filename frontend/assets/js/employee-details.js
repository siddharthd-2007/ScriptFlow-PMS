/* ==========================================================
                    EMPLOYEE DETAILS
========================================================== */

// ==========================================================
// URL PARAMETERS
// ==========================================================

const params = new URLSearchParams(window.location.search);

const employeeId = params.get("id");

// ==========================================================
// HERO
// ==========================================================

const employeeName =
    document.getElementById("employeeName");

const employeeDesignation =
    document.getElementById("employeeDesignation");

const breadcrumbEmployee =
    document.getElementById("breadcrumbEmployee");

const employeeStatusBadge =
    document.getElementById("employeeStatusBadge");

const employeeDepartmentBadge =
    document.getElementById("employeeDepartmentBadge");

const employeeRole =
    document.getElementById("employeeRole");

const joiningDate =
    document.getElementById("joiningDate");

// ==========================================================
// OVERVIEW
// ==========================================================

const editEmployeeModal =
    new bootstrap.Modal(
        document.getElementById("editEmployeeModal")
    );

const editFullName =
    document.getElementById("editFullName");

const editEmail =
    document.getElementById("editEmail");

const editPhone =
    document.getElementById("editPhone");

const editDepartment =
    document.getElementById("editDepartment");

const editRole =
    document.getElementById("editRole");

const editDesignation =
    document.getElementById("editDesignation");

const editJoiningDate =
    document.getElementById("editJoiningDate");

const editStatus =
    document.getElementById("editStatus");

const saveEmployeeBtn =
    document.getElementById("saveEmployeeBtn");

// ==========================================================
// ASSIGN TASK MODAL
// ==========================================================

const assignTaskModal =
    new bootstrap.Modal(
        document.getElementById("assignTaskModal")
    );

const assignTaskSelect =
    document.getElementById("assignTaskSelect");

const confirmAssignTaskBtn =
    document.getElementById("confirmAssignTaskBtn");    





const employeeOverviewStatus =
    document.getElementById("employeeOverviewStatus");

const employeeProjectsCount =
    document.getElementById("employeeProjectsCount");

const employeeTasksCount =
    document.getElementById("employeeTasksCount");

const employeeHoursLogged =
    document.getElementById("employeeHoursLogged");

const employeePerformance =
    document.getElementById("employeePerformance");

const employeeBio =
    document.getElementById("employeeBio");

// ==========================================================
// EMPLOYEE INFORMATION
// ==========================================================

const employeeEmail =
    document.getElementById("employeeEmail");

const employeePhone =
    document.getElementById("employeePhone");

const employeeDepartmentInfo =
    document.getElementById("employeeDepartmentInfo");

const employeeRoleInfo =
    document.getElementById("employeeRoleInfo");

const employeeJoining =
    document.getElementById("employeeJoining");

const employeeStatusInfo =
    document.getElementById("employeeStatusInfo");

const employeePerformanceText =
    document.getElementById("employeePerformanceText");

const employeePerformanceBar =
    document.getElementById("employeePerformanceBar");

// ==========================================================
// SECTIONS
// ==========================================================

const sections = {

    overview:
        document.getElementById("overviewSection"),

    projects:
        document.getElementById("projectsSection"),

    tasks:
        document.getElementById("tasksSection"),

    timelogs:
        document.getElementById("timelogsSection"),

    activity:
        document.getElementById("activitySection")

};

const workspaceTabs =
    document.querySelectorAll(".workspace-tab");

// ==========================================================
// TABLES
// ==========================================================

const employeeProjectsGrid =
    document.getElementById("employeeProjectsGrid");

const employeeTasksList =
    document.getElementById("employeeTasksList");

const employeeActivityFeed =
    document.getElementById("employeeActivityFeed");

// ==========================================================
// BUTTONS
// ==========================================================

const editEmployeeBtn =
    document.getElementById("editEmployeeBtn");

const assignTaskBtn =
    document.getElementById("assignTaskBtn");

// ==========================================================
// GLOBAL VARIABLES
// ==========================================================

let currentEmployee = null;

let employeeProjects = [];

let employeeTasks = [];

let employeeActivity = [];

let projectsLoaded = false;

let tasksLoaded = false;

// ==========================================================
// INITIALIZATION
// ==========================================================

document.addEventListener("DOMContentLoaded", async () => {

    loadSidebar("employees.html");

    loadTopbar({

        page: "Employee Workspace",

        subtitle:
            "Manage employee information and assignments.",

        showSearch: false

    });

    initializeTabs();

    initializeButtons();

    await loadEmployee();

    await loadEmployeeProjects();

projectsLoaded = true;

await loadEmployeeTasks();

tasksLoaded = true;

updateDashboard();

});

/* ==========================================================
                    LOAD EMPLOYEE
========================================================== */

async function loadEmployee() {

    try {

        currentEmployee = await apiRequest(
            `/employees/${employeeId}`
        );

        populateEmployee();

    }

    catch (error) {

        console.error(error);

        alert("Failed to load employee.");

    }

}

/* ==========================================================
                    POPULATE EMPLOYEE
========================================================== */

function populateEmployee() {

    // ---------------------------------------
    // Hero
    // ---------------------------------------

    employeeName.textContent =
        currentEmployee.full_name;

    breadcrumbEmployee.textContent =
        currentEmployee.full_name;

    employeeDesignation.textContent =
        currentEmployee.designation || "-";

    employeeRole.textContent =
        currentEmployee.role || "-";

    joiningDate.textContent =
        formatDate(currentEmployee.joining_date);

    // ---------------------------------------
    // Department Badge
    // ---------------------------------------

    employeeDepartmentBadge.textContent =
        currentEmployee.department ||
        "No Department";

    // ---------------------------------------
    // Status
    // ---------------------------------------

    const status =
        currentEmployee.is_active
            ? "Active"
            : "Inactive";

    employeeStatusBadge.textContent =
        status;

    employeeOverviewStatus.textContent =
        status;

    employeeStatusInfo.textContent =
        status;

    const badgeClass =
        currentEmployee.is_active
            ? "badge rounded-pill bg-success px-3 py-2"
            : "badge rounded-pill bg-secondary px-3 py-2";

    employeeStatusBadge.className =
        badgeClass;

    employeeOverviewStatus.className =
        badgeClass;

    // ---------------------------------------
    // Employee Information
    // ---------------------------------------

    employeeEmail.textContent =
        currentEmployee.email || "-";

    employeePhone.textContent =
        currentEmployee.phone || "-";

    employeeDepartmentInfo.textContent =
        currentEmployee.department || "-";

    employeeRoleInfo.textContent =
        currentEmployee.role || "-";

    employeeJoining.textContent =
        formatDate(currentEmployee.joining_date);

    employeeBio.textContent =
        currentEmployee.bio ||
        "No bio available.";

}
/* ==========================================================
                    WORKSPACE TABS
========================================================== */

function initializeTabs() {

    workspaceTabs.forEach(tab => {

        tab.addEventListener("click", async () => {

            // ---------------------------------------
            // Active Tab
            // ---------------------------------------

            workspaceTabs.forEach(button =>
                button.classList.remove("active")
            );

            tab.classList.add("active");

            // ---------------------------------------
            // Hide All Sections
            // ---------------------------------------

            Object.values(sections).forEach(section => {

                if (section) {

                    section.style.display = "none";

                }

            });

            // ---------------------------------------
            // Show Selected Section
            // ---------------------------------------

            const sectionName =
                tab.dataset.section;

            if (sections[sectionName]) {

                sections[sectionName].style.display =
                    "block";

            }

            // ---------------------------------------
            // Lazy Loading
            // ---------------------------------------

            if (sectionName === "projects" && !projectsLoaded) {

                await loadEmployeeProjects();

                projectsLoaded = true;

            }

            if (sectionName === "tasks" && !tasksLoaded) {

                await loadEmployeeTasks();

                tasksLoaded = true;

            }

            if (sectionName === "activity") {

                renderActivity();

            }

        });

    });

}

/* ==========================================================
                    BUTTON EVENTS
========================================================== */

function initializeButtons() {

    // ---------------------------------------
    // Edit Employee
    // ---------------------------------------

    if (editEmployeeBtn) {

        editEmployeeBtn.addEventListener("click", () => {

            editFullName.value =
                currentEmployee.full_name || "";

            editEmail.value =
                currentEmployee.email || "";

            editPhone.value =
                currentEmployee.phone || "";

            editDepartment.value =
                currentEmployee.department || "";

            editRole.value =
                currentEmployee.role || "";

            editDesignation.value =
                currentEmployee.designation || "";

            editJoiningDate.value =
                currentEmployee.joining_date || "";

            editStatus.value =
                currentEmployee.is_active
                    ? "true"
                    : "false";

            editEmployeeModal.show();

        });

    }

    // ---------------------------------------
    // Save Employee
    // ---------------------------------------

    if (saveEmployeeBtn) {

        saveEmployeeBtn.addEventListener(
            "click",
            saveEmployee
        );

    }

    if (confirmAssignTaskBtn) {

    confirmAssignTaskBtn.addEventListener(

        "click",

        assignTask

    );

}

    // ---------------------------------------
    // Assign Task
    // ---------------------------------------

    if (assignTaskBtn) {

    assignTaskBtn.addEventListener("click", async () => {

    await loadAvailableTasks();

    assignTaskModal.show();

});

}

}
/* ==========================================================
                SAVE EMPLOYEE
========================================================== */

async function saveEmployee() {

    try {

        const employeeData = {

            full_name:
                editFullName.value.trim(),

            phone:
                editPhone.value.trim(),

            department:
                editDepartment.value.trim(),

            role:
                editRole.value,

            designation:
                editDesignation.value.trim(),

            joining_date:
                editJoiningDate.value || null,

            is_active:
                editStatus.value === "true"

        };

        await apiRequest(
            `/employees/${employeeId}`,
            "PUT",
              employeeData
            );

        editEmployeeModal.hide();

        await loadEmployee();

        alert("Employee updated successfully.");

    }

    catch (error) {

        console.error(error);

        alert("Failed to update employee.");

    }

}

/* ==========================================================
                LOAD AVAILABLE TASKS
========================================================== */

async function loadAvailableTasks() {

    try {

        const tasks = await apiRequest("/tasks");

        assignTaskSelect.innerHTML = "";

        if (!tasks.length) {

            assignTaskSelect.innerHTML = `

                <option value="">

                    No tasks available

                </option>

            `;

            return;

        }

        tasks.forEach(task => {

            assignTaskSelect.innerHTML += `

                <option value="${task.id}">

                    ${task.title}

                </option>

            `;

        });

    }

    catch (error) {

        console.error(error);

    }

}

/* ==========================================================
                ASSIGN TASK
========================================================== */

async function assignTask() {

    try {

        const taskId = assignTaskSelect.value;

        if (!taskId) {

            alert("Please select a task.");

            return;

        }

        await apiRequest(

            `/tasks/${taskId}`,

            "PUT",

            {

                assigned_to: Number(employeeId)

            }

        );

        assignTaskModal.hide();

        await loadEmployeeTasks();

        updateDashboard();

        alert("Task assigned successfully.");

    }

    catch (error) {

        console.error(error);

        alert("Failed to assign task.");

    }

}

/* ==========================================================
                LOAD EMPLOYEE PROJECTS
========================================================== */



async function loadEmployeeProjects() {

    try {

        employeeProjects = await apiRequest(
            `/employees/${employeeId}/projects`
        );

        renderEmployeeProjects();

        updateDashboard();

    }

    catch (error) {

        console.error(error);

    }

}

/* ==========================================================
                LOAD EMPLOYEE TASKS
========================================================== */

async function loadEmployeeTasks() {

    try {

        employeeTasks = await apiRequest(
            `/employees/${employeeId}/tasks`
        );

        renderEmployeeTasks();

        updateDashboard();

    }

    catch (error) {

        console.error(error);

    }

}

/* ==========================================================
                UPDATE DASHBOARD
========================================================== */

function updateDashboard() {

    employeeProjectsCount.textContent =
        employeeProjects.length;

    employeeTasksCount.textContent =
        employeeTasks.length;

    // ---------------------------------------
    // Hours Logged
    // ---------------------------------------

    const totalHours =
        employeeTasks.reduce((sum, task) => {

            return sum + (task.actual_hours || 0);

        }, 0);

    employeeHoursLogged.textContent =
        totalHours;

    // ---------------------------------------
    // Performance
    // ---------------------------------------

    const completedTasks =
        employeeTasks.filter(task =>
            task.status?.toLowerCase() ===
            "completed"
        ).length;

    const performance =
        employeeTasks.length
            ? Math.round(
                completedTasks /
                employeeTasks.length *
                100
            )
            : 0;

    employeePerformance.textContent =
        `${performance}%`;

    employeePerformanceText.textContent =
        `${performance}%`;

    employeePerformanceBar.style.width =
        `${performance}%`;

    employeePerformanceBar.classList.remove(
        "bg-danger",
        "bg-warning",
        "bg-success"
    );

    if (performance >= 80) {

        employeePerformanceBar.classList.add(
            "bg-success"
        );

    }

    else if (performance >= 50) {

        employeePerformanceBar.classList.add(
            "bg-warning"
        );

    }

    else {

        employeePerformanceBar.classList.add(
            "bg-danger"
        );

    }

}

/* ==========================================================
                RENDER EMPLOYEE PROJECTS
========================================================== */

function renderEmployeeProjects() {

    if (!employeeProjectsGrid) return;

    employeeProjectsGrid.innerHTML = "";

    // Empty State
    if (!employeeProjects.length) {

        employeeProjectsGrid.innerHTML = `

            <div class="col-12">

                <div class="text-center py-5">

                    <i class="bi bi-kanban display-5 text-muted"></i>

                    <h5 class="mt-3">

                        No Projects Assigned

                    </h5>

                    <p class="text-muted">

                        This employee is not assigned to any projects yet.

                    </p>

                </div>

            </div>

        `;

        return;

    }

    employeeProjects.forEach(project => {

        employeeProjectsGrid.innerHTML += `

            <div class="col-xl-4 col-lg-6">

                <div class="card border-0 shadow-sm h-100">

                    <div class="card-body d-flex flex-column">

                        <div class="d-flex justify-content-between align-items-start mb-3">

                            <div>

                                <h5 class="fw-semibold mb-1">

                                    ${project.name}

                                </h5>

                                <div class="text-muted small">

                                    Client ID : ${project.client_id}

                                </div>

                            </div>

                            <span class="badge ${getStatusClass(project.status)}">

                                ${project.status}

                            </span>

                        </div>

                        <div class="mb-3">

                            <small class="text-muted">

                                Progress

                            </small>

                            <div class="progress mt-2">

                                <div
                                    class="progress-bar"
                                    style="width:${project.progress || 0}%">

                                </div>

                            </div>

                        </div>

                        <div class="small text-muted mb-3">

                            Deadline :
                            <strong>

                                ${formatDate(project.end_date)}

                            </strong>

                        </div>

                        <button
                            class="btn btn-outline-primary mt-auto open-project-btn"
                            data-id="${project.id}">

                            Open Project

                        </button>

                    </div>

                </div>

            </div>

        `;

    });

    document
        .querySelectorAll(".open-project-btn")
        .forEach(button => {

            button.addEventListener("click", () => {

                window.location.href =
                    `project-details.html?id=${button.dataset.id}`;

            });

        });

}

/* ==========================================================
                RENDER EMPLOYEE TASKS
========================================================== */

function renderEmployeeTasks() {

    if (!employeeTasksList) return;

    employeeTasksList.innerHTML = "";

    if (!employeeTasks.length) {

        employeeTasksList.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    class="text-center py-5 text-muted">

                    <i class="bi bi-list-task display-6 d-block mb-3"></i>

                    No Tasks Assigned

                </td>

            </tr>

        `;

        return;

    }

    employeeTasks.forEach(task => {

        employeeTasksList.innerHTML += `

            <tr>

                <td>

                    <strong>

                        ${task.title}

                    </strong>

                </td>

                <td>

                    Module #${task.module_id}

                </td>

                <td>

                    <span class="badge ${getPriorityClass(task.priority)}">

                        ${task.priority}

                    </span>

                </td>

                <td>

                    <span class="badge ${getStatusClass(task.status)}">

                        ${task.status}

                    </span>

                </td>

                <td>

                    ${formatDate(task.due_date)}

                </td>

                <td>

                    <button
                        class="btn btn-sm btn-outline-primary view-task-btn"
                        data-id="${task.id}">

                        View

                    </button>

                </td>

            </tr>

        `;

    });

    document
        .querySelectorAll(".view-task-btn")
        .forEach(button => {

            button.addEventListener("click", () => {

                window.location.href =
                    `task-details.html?id=${button.dataset.id}`;

            });

        });

}

/* ==========================================================
                RENDER ACTIVITY
========================================================== */

function renderActivity() {

    if (!employeeActivityFeed) return;

    employeeActivityFeed.innerHTML = `

        <div class="text-center py-5 text-muted">

            <i class="bi bi-activity display-5"></i>

            <h5 class="mt-3">

                Activity Timeline

            </h5>

            <p>

                Activity integration will be added later.

            </p>

        </div>

    `;

}




/* ==========================================================
                    HELPERS
========================================================== */

function formatDate(date) {

    if (!date) return "-";

    return new Date(date).toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}

function getStatusClass(status) {

    switch ((status || "").toLowerCase()) {

        case "planning":
            return "bg-secondary";

        case "to do":
            return "bg-secondary";

        case "in progress":
            return "bg-primary";

        case "testing":
            return "bg-warning text-dark";

        case "completed":
            return "bg-success";

        case "on hold":
            return "bg-warning text-dark";

        default:
            return "bg-dark";

    }

}

function getPriorityClass(priority) {

    switch ((priority || "").toLowerCase()) {

        case "low":
            return "bg-success";

        case "medium":
            return "bg-warning text-dark";

        case "high":
            return "bg-danger";

        case "critical":
            return "bg-dark";

        default:
            return "bg-secondary";

    }

}