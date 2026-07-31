/* ==========================================================
                    MODULE DETAILS
========================================================== */

// ==========================================================
// URL PARAMETERS
// ==========================================================

const params = new URLSearchParams(window.location.search);

const moduleId = params.get("id");
const projectId = params.get("project");

// ==========================================================
// DOM ELEMENTS
// ==========================================================

// Workspace Tabs
const workspaceTabs = document.querySelectorAll(".workspace-tab");

// Workspace Sections
const sections = {
    overview: document.getElementById("overviewSection"),
    tasks: document.getElementById("tasksSection"),
    team: document.getElementById("teamSection"),
    timeline: document.getElementById("timelineSection"),
    files: document.getElementById("filesSection"),
    activity: document.getElementById("activitySection")
};

// ==========================================================
// HERO
// ==========================================================

const moduleName = document.getElementById("moduleName");
const parentProjectName = document.getElementById("parentProjectName");

const breadcrumbProject = document.getElementById("breadcrumbProject");
const breadcrumbModule = document.getElementById("breadcrumbModule");

const moduleStatus = document.getElementById("moduleStatus");
const modulePriority = document.getElementById("modulePriority");
const moduleProgress = document.getElementById("moduleProgress");
const moduleDeadline = document.getElementById("moduleDeadline");

// ==========================================================
// OVERVIEW
// ==========================================================

const dashboardStatus = document.getElementById("moduleStatusBadge");

const progressValue = document.getElementById("moduleProgressValue");

const moduleCount = document.getElementById("moduleCount");
const totalTasks = document.getElementById("totalTasks");
const teamCount = document.getElementById("teamCount");

const moduleDescription = document.getElementById("moduleDescription");
const recentTasksContainer = document.getElementById("recentModules");

const infoStartDate = document.getElementById("moduleStartDate");
const infoEndDate = document.getElementById("moduleEndDate");
const infoPriority = document.getElementById("modulePriorityCard");
const infoCompletion = document.getElementById("moduleCompletion");

const progressText = document.getElementById("moduleProgressText");
const progressBar = document.getElementById("moduleProgressBar");

// ==========================================================
// TASKS
// ==========================================================

const tasksGrid = document.getElementById("tasksGrid");

const taskSearch = document.getElementById("taskSearch");
const taskSort = document.getElementById("taskSort");
/* ==========================================================
                    FILES
========================================================== */

const filesContainer = document.getElementById("filesContainer");
const uploadFileBtn = document.getElementById("uploadFileBtn");

let moduleFiles = [];
// ==========================================================
// BUTTONS
// ==========================================================

const editModuleBtn = document.getElementById("editModuleBtn");

const heroNewTaskBtn = document.getElementById("heroNewTaskBtn");
const overviewNewTaskBtn = document.getElementById("overviewNewTaskBtn");
const tasksNewTaskBtn = document.getElementById("tasksNewTaskBtn");

const backToProjectBtn = document.getElementById("backToProjectBtn");

// ==========================================================
// GLOBAL VARIABLES
// ==========================================================

let currentModule = null;

let currentProject = null;

let moduleTasks = [];

let tasksLoaded = false;

let employees = [];

let moduleTeam = [];

let taskModal;

let editModuleModal;

let editingTaskId = null;

let isEditMode = false;


// ==========================================================
// INITIALIZATION
// ==========================================================

document.addEventListener("DOMContentLoaded", async () => {

    const modalElement = document.getElementById("taskModal");

    taskModal = new bootstrap.Modal(modalElement);

    const editModuleElement = document.getElementById("editModuleModal");

    editModuleModal = new bootstrap.Modal(editModuleElement);

    initializeTabs();
initializeButtons();
initializeTaskFilters();

await loadEmployees();

await loadModule();

await loadTasks();

tasksLoaded = true;

    document
        .getElementById("saveTaskBtn")
        ?.addEventListener("click", () => {

            if (isEditMode) {

                updateTask();

            } else {

                createTask();

            }

        });

});

/* ==========================================================
                    TAB NAVIGATION
========================================================== */

function initializeTabs() {

    workspaceTabs.forEach(tab => {

        tab.addEventListener("click", async () => {

            // -----------------------------
            // Active Tab
            // -----------------------------

            workspaceTabs.forEach(btn =>
                btn.classList.remove("active")
            );

            tab.classList.add("active");

            // -----------------------------
            // Hide All Sections
            // -----------------------------

            Object.values(sections).forEach(section => {

                if (section) {
                    section.style.display = "none";
                }

            });

            // -----------------------------
            // Show Selected Section
            // -----------------------------

            const sectionName = tab.dataset.section;

            console.log(sectionName);

            const targetSection = sections[sectionName];

            if (targetSection) {
                targetSection.style.display = "block";
            }

            // -----------------------------
            // Lazy Load Tasks
            // -----------------------------

            if (sectionName === "tasks" && !tasksLoaded) {

    await loadTasks();

    tasksLoaded = true;

}

if (sectionName === "team") {

    if (!tasksLoaded) {

        await loadTasks();

        tasksLoaded = true;

    }

    await loadModuleTeam();

}

if (sectionName === "timeline") {

    if (!tasksLoaded) {

        await loadTasks();

        tasksLoaded = true;

    }

    loadTimeline();

}

if (sectionName === "files") {

    await loadFiles();

}
if (sectionName === "activity") {

    if (!tasksLoaded) {

        await loadTasks();

        tasksLoaded = true;

    }

    await loadFiles();

    loadActivity();

}

        });

    });

}
/* ==========================================================
                SHOW SECTION
========================================================== */

function showSection(sectionName) {

    Object.values(sections).forEach(section => {

        if (section) {

            section.style.display = "none";

        }

    });

    workspaceTabs.forEach(tab => {

        tab.classList.remove("active");

        if (tab.dataset.section === sectionName) {

            tab.classList.add("active");

        }

    });

    if (sections[sectionName]) {

        sections[sectionName].style.display = "block";

    }

}

/* ==========================================================
                    LOAD MODULE
========================================================== */

async function loadModule() {

    try {

        currentModule = await apiRequest(`/modules/${moduleId}`);

        currentProject = await apiRequest(`/projects/${currentModule.project_id}`);
        console.log("Project:", currentProject);
        console.log("Project Name:", currentProject.name);

        // ---------------------------------------
        // Store Project ID
        // ---------------------------------------

        window.currentProjectId = currentModule.project_id;

        // ---------------------------------------
        // Hero Section
        // ---------------------------------------

        moduleName.textContent =
            currentModule.name;

        parentProjectName.textContent =
            currentProject.name;


        breadcrumbProject.textContent =  
            currentProject.name;


        breadcrumbModule.textContent =
            currentModule.name;

        moduleStatus.textContent =
            currentModule.status;

        modulePriority.textContent =
            currentModule.priority;

        moduleProgress.textContent =
            `${currentModule.progress}%`;

        moduleDeadline.textContent =
            formatDate(currentModule.end_date);

        // ---------------------------------------
        // Overview Cards
        // ---------------------------------------

        dashboardStatus.textContent =
            currentModule.status;

        progressValue.textContent =
            `${currentModule.progress}%`;

        moduleDescription.textContent =
            currentModule.description ||
            "No module description available.";

        infoStartDate.textContent =
            formatDate(currentModule.start_date);

        infoEndDate.textContent =
            formatDate(currentModule.end_date);

        infoPriority.textContent =
            currentModule.priority;

        infoCompletion.textContent =
            `${currentModule.progress}%`;

        progressText.textContent =
            `${currentModule.progress}%`;

        progressBar.style.width =
            `${currentModule.progress}%`;

        // ---------------------------------------
        // Temporary Statistics
        // ---------------------------------------

        totalTasks.textContent = "-";

        teamCount.textContent = "-";

        // ---------------------------------------
        // Progress Bar Color
        // ---------------------------------------

        progressBar.classList.remove(
            "bg-danger",
            "bg-warning",
            "bg-info",
            "bg-success"
        );

        if (currentModule.progress < 30) {

            progressBar.classList.add("bg-danger");

        }
        else if (currentModule.progress < 60) {

            progressBar.classList.add("bg-warning");

        }
        else if (currentModule.progress < 90) {

            progressBar.classList.add("bg-info");

        }
        else {

            progressBar.classList.add("bg-success");

        }

    }

    catch (error) {

        console.error("Failed to load module:", error);

        alert("Unable to load module details.");

    }

}

/* ==========================================================
                    LOAD TASKS
========================================================== */

async function loadTasks() {

    try {

        moduleTasks = await apiRequest(`/tasks/module/${moduleId}`);

        totalTasks.textContent = moduleTasks.length;

        renderTasks(moduleTasks);

updateModuleStatistics();

renderRecentTasks();

    }
    catch (error) {

        console.error("Failed to load tasks:", error);

        tasksGrid.innerHTML = `
            <div class="col-12">
                <div class="alert alert-danger">
                    Failed to load tasks.
                </div>
            </div>
        `;

    }

}

/* ==========================================================
                    LOAD EMPLOYEES
========================================================== */

async function loadEmployees() {

    employees = await apiRequest("/employees/");

    populateEmployeeDropdown();

}

/* ==========================================================
                    POPULATE EMPLOYEE DROPDOWN
========================================================== */

function populateEmployeeDropdown() {

    const select = document.getElementById("taskAssignee");

    if (!select) return;

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

/* ==========================================================
                    RENDER TASKS
========================================================== */

function renderTasks(tasks) {

    tasksGrid.innerHTML = "";

    if (!tasks || tasks.length === 0) {

        tasksGrid.innerHTML = `

            <div class="col-12">

                <div class="text-center py-5">

                    <i class="bi bi-list-task display-5 text-muted"></i>

                    <h5 class="mt-3">

                        No Tasks Found

                    </h5>

                    <p class="text-muted">

                        Create the first task for this module.

                    </p>

                </div>

            </div>

        `;

        return;

    }

    tasks.forEach(task => {

        const priorityClass = getPriorityClass(task.priority);

        const statusClass = getStatusClass(task.status);

        tasksGrid.innerHTML += `

            <div class="col-xl-4 col-lg-6">

                <div class="card shadow-sm border-0 h-100 task-card">

                    <div class="card-body d-flex flex-column">

                        <div class="d-flex justify-content-between align-items-start mb-3">

                            <h5 class="fw-semibold mb-0">

                                ${task.title}

                            </h5>

                            <span class="badge ${priorityClass}">

                                ${task.priority}

                            </span>

                        </div>

                        <p class="text-muted small flex-grow-1">

                            ${task.description || "No description provided."}

                        </p>

                        <div class="mb-2">

                            <span class="badge ${statusClass}">

                                ${task.status}

                            </span>

                        </div>

                        <div class="small text-muted mb-2">

                            <i class="bi bi-clock"></i>

                            Estimated Hours:
                            <strong>

                                ${task.estimated_hours ?? "-"}

                            </strong>

                        </div>

                        <div class="small text-muted mb-3">

                            <i class="bi bi-calendar-event"></i>

                            Due:

                            <strong>

                                ${formatDate(task.due_date)}

                            </strong>

                        </div>

                        <div class="d-flex gap-2 mt-auto">

                            <button
                                class="btn btn-outline-primary btn-sm flex-fill view-task-btn"
                                data-id="${task.id}">

                                View

                            </button>

                            <button
                                class="btn btn-outline-secondary btn-sm edit-task-btn"
                                data-id="${task.id}">

                                Edit

                            </button>

                        </div>

                    </div>

                </div>

            </div>

        `;

    });

    attachTaskEvents();

}
/* ==========================================================
                    TASK FILTERS
========================================================== */
function renderRecentTasks() {

    if (!recentTasksContainer) return;

    if (!moduleTasks.length) {

        recentTasksContainer.innerHTML = `
            <div class="text-center py-5 text-muted">
                <i class="bi bi-list-task display-6"></i>
                <p class="mt-3 mb-0">
                    No tasks created yet.
                </p>
            </div>
        `;

        return;
    }

    const recentTasks = [...moduleTasks]
        .sort((a, b) => b.id - a.id)
        .slice(0, 5);

    recentTasksContainer.innerHTML = recentTasks.map(task => `

        <div class="d-flex justify-content-between align-items-center border-bottom py-3">

            <div>

                <h6 class="mb-1">${escapeHtml(task.title)}</h6>

                <small class="text-muted">
                    ${task.priority} • ${task.status}
                </small>

            </div>

            <button
                class="btn btn-sm btn-outline-primary view-task-btn"
                data-id="${task.id}">

                Open

            </button>

        </div>

    `).join("");

    attachTaskEvents();

}

function initializeTaskFilters() {

    if (!taskSearch || !taskSort) {
        return;
    }

    taskSearch.addEventListener("input", applyTaskFilters);

    taskSort.addEventListener("change", applyTaskFilters);

}

/* ==========================================================
                    APPLY FILTERS
========================================================== */

function applyTaskFilters() {

    let filteredTasks = [...moduleTasks];

    // Search
    const keyword = taskSearch.value.trim().toLowerCase();

    if (keyword) {

        filteredTasks = filteredTasks.filter(task =>
            task.title.toLowerCase().includes(keyword) ||
            (task.description || "").toLowerCase().includes(keyword)
        );

    }

    // Sort
    switch (taskSort.value) {

        case "name":

            filteredTasks.sort((a, b) =>
                a.title.localeCompare(b.title)
            );

            break;

        case "priority":

            const priorityOrder = {
                "Critical": 4,
                "High": 3,
                "Medium": 2,
                "Low": 1
            };

            filteredTasks.sort((a, b) =>
                (priorityOrder[b.priority] || 0) -
                (priorityOrder[a.priority] || 0)
            );

            break;

        case "latest":

        default:

            filteredTasks.sort((a, b) => b.id - a.id);

            break;

    }

    renderTasks(filteredTasks);

updateModuleStatistics();

renderRecentTasks();

}

/* ==========================================================
                    RESET FILTERS
========================================================== */

function resetTaskFilters() {

    if (taskSearch)
        taskSearch.value = "";

    if (taskPriorityFilter)
        taskPriorityFilter.value = "";

    if (taskStatusFilter)
        taskStatusFilter.value = "";

    renderTasks(moduleTasks);
    updateModuleStatistics();
    renderRecentTasks();

}

/* ==========================================================
                    REFRESH TASKS
========================================================== */

async function refreshTasks() {

    tasksLoaded = false;

    await loadTasks();

    tasksLoaded = true;

}

/* ==========================================================
                    TASK EVENTS
========================================================== */

function attachTaskEvents() {

    document.querySelectorAll(".view-task-btn").forEach(button => {

    button.addEventListener("click", () => {

        const taskId = button.dataset.id;

        console.log("Task ID:", taskId);
        console.log("Destination:", `task-details.html?id=${taskId}`);

        window.location.href = `task-details.html?id=${taskId}`;

    });

});

    document.querySelectorAll(".edit-task-btn").forEach(button => {

    button.addEventListener("click", () => {

        const taskId = button.dataset.id;

        console.log("Edit button clicked", taskId);

        openEditTask(taskId);

    });

    });

}

/* ==========================================================
                    BUTTONS
========================================================== */

function initializeButtons() {

    if (fileInput) {

    fileInput.addEventListener("change", async () => {

        if (!fileInput.files.length) return;

        try {

            const selectedFile = fileInput.files[0];

            const formData = new FormData();

            formData.append("module_id", moduleId);

            // Temporary user id
            // Later we'll replace this with the logged-in user's ID.
            formData.append("uploaded_by", 1);

            formData.append("file", selectedFile);

            const token = localStorage.getItem("access_token");

            const response = await fetch(
                `${API_BASE_URL}/files/upload`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    body: formData
                }
            );

            if (!response.ok) {

                throw new Error("Upload failed.");

            }

            await loadFiles();

            fileInput.value = "";

            alert("File uploaded successfully.");

        }

        catch (error) {

            console.error(error);

            alert("Failed to upload file.");

        }

    });

}

    if (uploadFileBtn) {

    uploadFileBtn.addEventListener("click", () => {

        fileInput.click();

    });

}

    // ---------------------------------------
    // Back To Project
    // ---------------------------------------

    if (backToProjectBtn) {

        backToProjectBtn.addEventListener("click", (e) => {

            e.preventDefault();

            if (window.currentProjectId) {

                window.location.href =
                    `project-details.html?id=${window.currentProjectId}`;

            } else {

                window.location.href = "projects.html";

            }

        });

    }

// ---------------------------------------
// Hero New Task
// ---------------------------------------

    if (heroNewTaskBtn) {
        
        heroNewTaskBtn.addEventListener("click", () => {

        console.log("Hero New Task clicked");

        openCreateTaskModal();

    });

}
if (overviewNewTaskBtn) {

    overviewNewTaskBtn.addEventListener("click", () => {

        console.log("Overview New Task clicked");

        openCreateTaskModal();

    });

}

    // ---------------------------------------
    // Tasks New Task
    // ---------------------------------------

    if (tasksNewTaskBtn) {

        tasksNewTaskBtn.addEventListener("click", () => {

            openCreateTaskModal();

        });

    }

    /* ==========================================================
                OPEN EDIT TASK
========================================================== */


    // ---------------------------------------
    // Edit Module
    // ---------------------------------------

    if (editModuleBtn) {

        editModuleBtn.addEventListener("click", () => {

            openEditModuleModal();

        });

    }


}

// 
/* ==========================================================
                OPEN EDIT TASK
========================================================== */

function openEditTask(taskId) {

    const task = moduleTasks.find(t => t.id == taskId);

    if (!task) return;

    editingTaskId = task.id;

    isEditMode = true;

    document.getElementById("taskTitle").value =
        task.title || "";

    document.getElementById("taskDescription").value =
        task.description || "";

    document.getElementById("taskModule").innerHTML = `
        <option value="${currentModule.id}" selected>
            ${currentModule.name}
        </option>
    `;

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

    document.getElementById("taskModalTitle").textContent =
        "Edit Task";

    document.getElementById("saveTaskBtn").innerHTML = `
        <i class="bi bi-check-lg me-2"></i>
        Update Task
    `;

    taskModal.show();

}
/* ==========================================================
                CREATE TASK
========================================================== */

function openCreateTaskModal() {

    console.log("openCreateTaskModal()");

    isEditMode = false;

    editingTaskId = null;

    document.getElementById("taskForm").reset();

    document.getElementById("taskModalTitle").textContent =
        "Create New Task";

    document.getElementById("saveTaskBtn").innerHTML = `
        <i class="bi bi-check-lg me-2"></i>
        Create Task
    `;

    // Automatically select the current module
    const moduleSelect = document.getElementById("taskModule");

moduleSelect.innerHTML = `
    <option value="${currentModule.id}" selected>
        ${currentModule.name}
    </option>
`;

    taskModal.show();

}

/* ==========================================================
                CREATE TASK
========================================================== */

async function createTask() {

    const taskData = {

        title: document.getElementById("taskTitle").value.trim(),

        description: document.getElementById("taskDescription").value.trim(),

        module_id: Number(currentModule.id),

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

        alert("Module not found.");

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

        await refreshTasks();
        loadActivity();

    }

    catch (error) {

        console.error(error);

        alert("Failed to create task.");

    }

}

/* ==========================================================
                UPDATE TASK
========================================================== */

async function updateTask() {

    const taskData = {

        title: document.getElementById("taskTitle").value.trim(),

        description: document.getElementById("taskDescription").value.trim(),

        module_id: Number(currentModule.id),

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

        await refreshTasks();
        loadActivity();

    }

    catch (error) {

        console.error(error);

        alert("Failed to update task.");

    }

}

/* ==========================================================
                EDIT MODULE
========================================================== */

function openEditModuleModal() {

    if (!currentModule) return;

    document.getElementById("editModuleName").value =
        currentModule.name || "";

    document.getElementById("editModuleDescription").value =
        currentModule.description || "";

    document.getElementById("editModuleStatus").value =
        currentModule.status || "";

    document.getElementById("editModulePriority").value =
        currentModule.priority || "";

    document.getElementById("editModuleStartDate").value =
        currentModule.start_date
            ? currentModule.start_date.substring(0, 10)
            : "";

    document.getElementById("editModuleEndDate").value =
        currentModule.end_date
            ? currentModule.end_date.substring(0, 10)
            : "";

    document.getElementById("editModuleProgress").value =
        currentModule.progress ?? 0;

    editModuleModal.show();

}

/* ==========================================================
                DELETE TASK
========================================================== */

async function deleteTask(taskId) {

    const confirmed = confirm(
        "Are you sure you want to delete this task?"
    );

    if (!confirmed)
        return;

    try {

        await apiRequest(`/tasks/${taskId}`, {

            method: "DELETE"

        });

        await refreshTasks();
        loadActivity();

    }

    catch (error) {

        console.error(error);

        alert("Failed to delete task.");

    }

}

/* ==========================================================
                UPDATE MODULE STATS
========================================================== */

function updateModuleStatistics() {

    const totalTasks = moduleTasks.length;

    const completedTasks = moduleTasks.filter(
        task => task.status?.toLowerCase() === "completed"
    ).length;

    const progress = totalTasks
        ? Math.round((completedTasks / totalTasks) * 100)
        : 0;

    // Dashboard Cards
    document.getElementById("totalTasks").textContent = totalTasks;
    const memberCount = new Set(
    moduleTasks
        .map(task => task.assigned_to)
        .filter(id => id)
).size;

document.getElementById("teamCount").textContent = memberCount;

    document.getElementById("moduleProgressValue").textContent = `${progress}%`;

    // Progress Card
    document.getElementById("moduleCompletion").textContent = `${progress}%`;
    document.getElementById("moduleProgress").textContent = `${progress}%`;
    document.getElementById("moduleProgressText").textContent = `${progress}%`;

    const progressBar = document.getElementById("moduleProgressBar");

    progressBar.style.width = `${progress}%`;

    progressBar.className = "progress-bar";

    if (progress >= 80) {
        progressBar.classList.add("bg-success");
    } else if (progress >= 50) {
        progressBar.classList.add("bg-warning");
    } else {
        progressBar.classList.add("bg-danger");
    }
}

/* ==========================================================
                    MODULE TEAM
========================================================== */

async function loadModuleTeam() {

    const teamGrid = document.getElementById("moduleTeamGrid");

    if (!teamGrid) return;

    teamGrid.innerHTML = `
        <div class="col-12 text-center py-5 text-muted">
            Loading team...
        </div>
    `;

    try {

        // Get unique assigned employee IDs
        const employeeIds = [
            ...new Set(
                moduleTasks
                    .map(task => task.assigned_to)
                    .filter(id => id)
            )
        ];

        moduleTeam = [];

        // Load each employee
        for (const id of employeeIds) {

            const employee = await apiRequest(`/employees/${id}`);

            moduleTeam.push(employee);

        }

        // Update Overview count
        teamCount.textContent = moduleTeam.length;

        // Empty State
        if (moduleTeam.length === 0) {

            teamGrid.innerHTML = `
                <div class="col-12 text-center py-5 text-muted">

                    <i class="bi bi-people display-5"></i>

                    <h5 class="mt-3">
                        No Team Members
                    </h5>

                    <p>
                        Assign employees to tasks to build the module team.
                    </p>

                </div>
            `;

            return;

        }

        teamGrid.innerHTML = "";

        moduleTeam.forEach(employee => {

            teamGrid.innerHTML += `
                <div class="col-lg-4 col-md-6">

                    <div class="card border-0 shadow-sm h-100">

                        <div class="card-body text-center">

                            <div
                                class="rounded-circle bg-primary text-white
                                d-flex align-items-center justify-content-center
                                mx-auto mb-3"
                                style="width:70px;height:70px;font-size:24px;">

                                ${employee.full_name.charAt(0)}

                            </div>

                            <h5 class="mb-1">
                                ${employee.full_name}
                            </h5>

                            <div class="text-muted mb-3">
                                ${employee.designation || "-"}
                            </div>

                            <div class="small text-muted mb-2">
                                ${employee.department || "-"}
                            </div>

                            <div class="small">
                                ${employee.email || "-"}
                            </div>

                        </div>

                    </div>

                </div>
            `;

        });

    }

    catch (error) {

        console.error(error);

        teamGrid.innerHTML = `
            <div class="col-12 text-danger text-center py-5">
                Failed to load team members.
            </div>
        `;

    }

}
/* ==========================================================
                    TIMELINE
========================================================== */

function loadTimeline() {

    const container = document.getElementById("timelineContainer");

    if (!container) return;

    container.innerHTML = "";

    // ---------------------------------------
    // Module Event
    // ---------------------------------------

    const events = [];

    events.push({

        type: "module",

        title: currentModule.name,

        status: currentModule.status,

        date: currentModule.start_date,

        due_date: currentModule.end_date,

        priority: currentModule.priority

    });

    // ---------------------------------------
    // Task Events
    // ---------------------------------------

    moduleTasks.forEach(task => {

        events.push({

            type: "task",

            title: task.title,

            status: task.status,

            date: task.start_date || task.due_date,

            due_date: task.due_date,

            priority: task.priority

        });

    });

    // ---------------------------------------
    // Sort by Date
    // ---------------------------------------

    events.sort((a, b) => {

        return new Date(a.date || 0) - new Date(b.date || 0);

    });

    // ---------------------------------------
    // Empty State
    // ---------------------------------------

    if (!events.length) {

        container.innerHTML = `
            <div class="text-center py-5 text-muted">

                <i class="bi bi-calendar-x display-5"></i>

                <h5 class="mt-3">
                    No Timeline Available
                </h5>

            </div>
        `;

        return;

    }

    // ---------------------------------------
    // Render Events
    // ---------------------------------------

    events.forEach(event => {

    container.innerHTML += `

        <div class="timeline-item">

            <div class="timeline-dot"></div>

            <div class="timeline-card">

                <div class="card shadow-sm border-0">

                    <div class="card-body">

                        <div class="d-flex justify-content-between">

                            <div>

                                <h5 class="mb-1">

                                    ${event.title}

                                </h5>

                                <div class="text-muted">

                                    ${event.type === "module"
                                        ? "Module"
                                        : "Task"}

                                </div>

                            </div>

                            <span class="badge bg-primary">

                                ${event.status}

                            </span>

                        </div>

                        <hr>

                        <div class="row">

                            <div class="col-md-4">

                                <small class="text-muted">

                                    Start

                                </small>

                                <div>

                                    ${formatDate(event.date)}

                                </div>

                            </div>

                            <div class="col-md-4">

                                <small class="text-muted">

                                    Due

                                </small>

                                <div>

                                    ${formatDate(event.due_date)}

                                </div>

                            </div>

                            <div class="col-md-4">

                                <small class="text-muted">

                                    Priority

                                </small>

                                <div>

                                    ${event.priority}

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>

        `;

    });

}

/* ==========================================================
                    LOAD FILES
========================================================== */

async function loadFiles() {

    try {

        moduleFiles = await apiRequest(`/files/module/${moduleId}`);

        renderFiles(moduleFiles);

    }

    catch (error) {

        console.error("Failed to load files:", error);

    }

}



/* ==========================================================
                    RENDER FILES
========================================================== */

function renderFiles(files) {

    if (!filesContainer) return;

    // Empty State
    if (!files.length) {

        filesContainer.innerHTML = `
            <div class="text-center py-5 text-muted">

                <i class="bi bi-folder2-open display-5"></i>

                <h5 class="mt-3">
                    No Files Uploaded
                </h5>

                <p>
                    Upload your first file for this module.
                </p>

            </div>
        `;

        return;

    }

    filesContainer.innerHTML = "";

    files.forEach(file => {

        filesContainer.innerHTML += `

            <div class="card border-0 shadow-sm mb-3">

                <div class="card-body">

                    <div class="d-flex justify-content-between align-items-center">

                        <div class="d-flex align-items-center">

                            <div class="me-3">

                                <i class="bi bi-file-earmark fs-2 text-primary"></i>

                            </div>

                            <div>

                                <h6 class="mb-1">

                                    ${file.original_name}

                                </h6>

                                <small class="text-muted">

                                    ${(file.file_size / 1024).toFixed(1)} KB

                                </small>

                            </div>

                        </div>

                        <div class="d-flex gap-2">

    <button
        class="btn btn-outline-primary btn-sm download-file-btn"
        data-id="${file.id}">

        <i class="bi bi-download"></i>

    </button>

    <button
        class="btn btn-outline-danger btn-sm delete-file-btn"
        data-id="${file.id}">

        <i class="bi bi-trash"></i>

    </button>

</div>

                    </div>

                </div>

            </div>

        `;

    });
    attachFileEvents();

}

/* ==========================================================
                    FILE EVENTS
========================================================== */

function attachFileEvents() {

    // -----------------------------
    // Download
    // -----------------------------

    document.querySelectorAll(".download-file-btn").forEach(button => {

        button.addEventListener("click", () => {

            const fileId = button.dataset.id;

            window.open(
                `${API_BASE_URL}/files/download/${fileId}`,
                "_blank"
            );

        });

    });

    // -----------------------------
    // Delete
    // -----------------------------

    document.querySelectorAll(".delete-file-btn").forEach(button => {

        button.addEventListener("click", async () => {

            const fileId = button.dataset.id;

            const confirmed = confirm(
                "Are you sure you want to delete this file?"
            );

            if (!confirmed) return;

            try {

                await apiRequest(
                    `/files/${fileId}`,
                    "DELETE"
                );

                await loadFiles();

                alert("File deleted successfully.");

            }

            catch (error) {

                console.error(error);

                alert("Failed to delete file.");

            }

        });

    });

}


/* ==========================================================
                    LOAD ACTIVITY
========================================================== */

function loadActivity() {

    const container = document.getElementById("activityContainer");

    if (!container) return;

    const activities = [];

    // ---------------------------------------
    // Module Created
    // ---------------------------------------

    if (currentModule) {

        activities.push({
            type: "module",
            icon: "bi-box-seam",
            title: "Module Created",
            description: currentModule.name,
            date: currentModule.start_date
        });

    }

    // ---------------------------------------
    // Tasks
    // ---------------------------------------

    moduleTasks.forEach(task => {

        activities.push({
            type: "task",
            icon: "bi-list-task",
            title: "Task Created",
            description: task.title,
            date: task.start_date || task.due_date
        });

    });

    // ---------------------------------------
    // Files
    // ---------------------------------------

    moduleFiles.forEach(file => {

        activities.push({
            type: "file",
            icon: "bi-file-earmark-arrow-up",
            title: "File Uploaded",
            description: file.original_name,
            date: file.uploaded_at
        });

    });


    // ---------------------------------------
    // Sort Latest First
    // ---------------------------------------

    activities.sort((a, b) =>
        new Date(b.date || 0) - new Date(a.date || 0)
    );

    // ---------------------------------------
    // Empty State
    // ---------------------------------------

    if (!activities.length) {

        container.innerHTML = `
            <div class="text-center py-5 text-muted">

                <i class="bi bi-clock-history display-5"></i>

                <h5 class="mt-3">
                    No Activity Yet
                </h5>

                <p>
                    Activity will appear here as your team works on this module.
                </p>

            </div>
        `;

        return;

    }

    // ---------------------------------------
    // Render Feed
    // ---------------------------------------

    container.innerHTML = "";

    activities.forEach(activity => {

        container.innerHTML += `

            <div class="card border-0 shadow-sm mb-3">

                <div class="card-body">

                    <div class="d-flex align-items-start">

                        <div
                            class="rounded-circle bg-primary text-white
                                   d-flex align-items-center justify-content-center me-3"
                            style="width:48px;height:48px;">

                            <i class="bi ${activity.icon}"></i>

                        </div>

                        <div class="flex-grow-1">

                            <h6 class="mb-1">

                                ${activity.title}

                            </h6>

                            <div class="text-muted">

                                ${activity.description}

                            </div>

                            <small class="text-muted">

                                ${formatDate(activity.date)}

                            </small>

                        </div>

                    </div>

                </div>

            </div>

        `;

    });

}


/* ==========================================================
                    HELPERS
========================================================== */

/**
 * Format Date
 */
function formatDate(date) {

    if (!date)
        return "-";

    try {

        return new Date(date).toLocaleDateString("en-IN", {

            day: "2-digit",
            month: "short",
            year: "numeric"

        });

    }
    catch {

        return date;

    }

}

/**
 * Priority Badge
 */
function getPriorityClass(priority) {

    switch ((priority || "").toLowerCase()) {

        case "critical":
            return "bg-danger";

        case "high":
            return "bg-warning text-dark";

        case "medium":
            return "bg-info text-dark";

        case "low":
            return "bg-success";

        default:
            return "bg-secondary";

    }

}

/**
 * Status Badge
 */
function getStatusClass(status) {

    switch ((status || "").toLowerCase()) {

        case "todo":
            return "bg-secondary";

        case "in progress":
        case "progress":
            return "bg-primary";

        case "review":
            return "bg-warning text-dark";

        case "completed":
        case "done":
            return "bg-success";

        case "blocked":
            return "bg-danger";

        default:
            return "bg-dark";

    }

}

/**
 * Escape HTML
 */
function escapeHtml(text) {

    if (text === null || text === undefined)
        return "";

    return text
        .toString()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}

/**
 * Toast
 */
function showToast(message, type = "success") {

    console.log(`[${type.toUpperCase()}] ${message}`);

}

/**
 * Loading State
 */
function setButtonLoading(button, loading = true) {

    if (!button)
        return;

    if (loading) {

        button.dataset.originalText = button.innerHTML;

        button.disabled = true;

        button.innerHTML = `
            <span class="spinner-border spinner-border-sm me-2"></span>
            Loading...
        `;

    } else {

        button.disabled = false;

        button.innerHTML =
            button.dataset.originalText || "Submit";

    }

}

/**
 * Refresh Overview Statistics
 */
function refreshOverview() {

    totalTasks.textContent = moduleTasks.length;

    if (!currentModule)
        return;

    progressValue.textContent =
        `${currentModule.progress}%`;

    progressText.textContent =
        `${currentModule.progress}%`;

    progressBar.style.width =
        `${currentModule.progress}%`;

}

/**
 * Refresh Everything
 */
async function refreshPageData() {

    await loadModule();

    if (tasksLoaded) {

        await loadTasks();

    }

}

/* ==========================================================
                    END OF FILE
========================================================== */