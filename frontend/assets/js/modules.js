/* ==========================================================
                        MODULES
========================================================== */

// ==========================================================
// DOM ELEMENTS
// ==========================================================

const modulesTableBody = document.getElementById("modulesTableBody");

const totalModules = document.getElementById("totalModules");
const completedModules = document.getElementById("completedModules");
const progressModules = document.getElementById("progressModules");
const delayedModules = document.getElementById("delayedModules");

const moduleSearch = document.getElementById("moduleSearch");
const statusFilter = document.getElementById("statusFilter");
const priorityFilter = document.getElementById("priorityFilter");
const projectFilter = document.getElementById("projectFilter");
const resetFilters = document.getElementById("resetFilters");

const newModuleBtn = document.getElementById("newModuleBtn");

// ==========================================================
// GLOBAL VARIABLES
// ==========================================================

let moduleModal;

let editingModuleId = null;

let isEditMode = false;

let modules = [];
let filteredModules = [];

let projects = [];
let employees = [];

// ==========================================================
// LOOKUP MAPS
// ==========================================================

let projectMap = {};
let employeeMap = {};

// ==========================================================
// INITIALIZATION
// ==========================================================

document.addEventListener("DOMContentLoaded", async () => {

    loadSidebar("modules.html");

    initializeTopbar({
        page: "Modules",
        subtitle: "Manage all project modules.",
        showSearch: false,
        showNewButton: true,
        newButtonText: "New Module",
        newButtonId: "newModuleBtn"
    });

    await initializePage();

});

// ==========================================================
// INITIALIZE PAGE
// ==========================================================

async function initializePage() {

    moduleModal = new bootstrap.Modal(
        document.getElementById("moduleModal")
    );

    document
        .getElementById("moduleModal")
        ?.addEventListener("hidden.bs.modal", () => {

            isEditMode = false;

            editingModuleId = null;

            document.getElementById("moduleForm").reset();

            document.getElementById("moduleModalTitle").textContent =
                "Create New Module";

            document.getElementById("saveModuleBtn").innerHTML = `
                <i class="bi bi-check-lg me-2"></i>
                Create Module
            `;

        });

    document
        .getElementById("newModuleBtn")
        ?.addEventListener("click", () => {

            isEditMode = false;

            editingModuleId = null;

            document.getElementById("moduleForm").reset();

            document.getElementById("moduleModalTitle").textContent =
                "Create New Module";

            document.getElementById("saveModuleBtn").innerHTML = `
                <i class="bi bi-check-lg me-2"></i>
                Create Module
            `;

            moduleModal.show();

        });

    document
        .getElementById("saveModuleBtn")
        ?.addEventListener("click", () => {

            if (isEditMode) {

                updateModule();

            } else {

                createModule();

            }

        });

    showLoading();

    try {

        await Promise.all([

            loadModules(),
            loadProjects(),
            loadEmployees()

        ]);

        createLookupMaps();

        populateProjectDropdown();   
        populateLeadDropdown(); 

        populateProjectFilter();

        updateStatistics();

        renderModules();

        attachFilterEvents();

    }

    catch (error) {

        console.error(error);

        showError("Failed to load modules.");

    }

}

// ==========================================================
// LOAD DATA
// ==========================================================

async function loadModules() {

    modules = await apiRequest("/modules/");

    filteredModules = [...modules];

}

async function loadProjects() {

    projects = await apiRequest("/projects/");

}

async function loadEmployees() {

    employees = await apiRequest("/employees/");

}

// ==========================================================
// LOOKUP MAPS
// ==========================================================

function createLookupMaps() {

    projectMap = {};

    employeeMap = {};

    projects.forEach(project => {

        projectMap[project.id] = project.name;

    });

    employees.forEach(employee => {

        employeeMap[employee.id] = employee.full_name;

    });

}
/* ==========================================================
                    LOADING
========================================================== */

function showLoading() {

    modulesTableBody.innerHTML = `
        <tr>
            <td colspan="8" class="text-center py-5">
                <div class="spinner-border"></div>
                <div class="mt-3">
                    Loading Modules...
                </div>
            </td>
        </tr>
    `;

}

/* ==========================================================
                    ERROR
========================================================== */

function showError(message) {

    modulesTableBody.innerHTML = `
        <tr>
            <td colspan="8"
                class="text-center text-danger py-5">

                ${message}

            </td>
        </tr>
    `;

}

/* ==========================================================
                    RENDER MODULES
========================================================== */

function renderModules() {

    modulesTableBody.innerHTML = "";

    if (!filteredModules.length) {

        modulesTableBody.innerHTML = `
            <tr>

                <td colspan="8" class="text-center py-5">

                    <i class="bi bi-box display-5 text-muted"></i>

                    <h5 class="mt-3">
                        No Modules Found
                    </h5>

                    <p class="text-muted mb-0">
                        Create your first module to get started.
                    </p>

                </td>

            </tr>
        `;

        return;

    }

    filteredModules.forEach(module => {

        modulesTableBody.innerHTML += `

            <tr>

                <td>

                    <div class="fw-semibold">

                        <a
                            href="module-details.html?id=${module.id}"
                            class="text-decoration-none text-dark">

                            ${module.name}

                        </a>

                    </div>

                    <small class="text-muted">

                        ${module.description || ""}

                    </small>

                </td>

                <td>

                    ${projectMap[module.project_id] || "-"}

                </td>

                <td>

                    ${employeeMap[module.lead_id] || "Unassigned"}

                </td>

                <td>

                    ${renderStatusBadge(module.status)}

                </td>

                <td>

                    ${renderPriorityBadge(module.priority)}

                </td>

                <td>

                    ${module.progress ?? 0}%

                </td>

                <td>

                    ${formatDate(module.end_date)}

                </td>

                <td>

                    <div class="d-flex gap-2 justify-content-center">

                        <a
                            href="module-details.html?id=${module.id}"
                            class="btn btn-sm btn-outline-secondary"
                            title="View Module">

                            <i class="bi bi-eye"></i>

                        </a>

                        <button
                            class="btn btn-sm btn-outline-primary edit-module"
                            data-id="${module.id}"
                            title="Edit Module">

                            <i class="bi bi-pencil"></i>

                        </button>

                        <button
                            class="btn btn-sm btn-outline-danger delete-module"
                            data-id="${module.id}"
                            title="Delete Module">

                            <i class="bi bi-trash"></i>

                        </button>

                    </div>

                </td>

            </tr>

        `;

    });

    attachModuleEvents();

}

/* ==========================================================
                    STATISTICS
========================================================== */

function updateStatistics() {

    totalModules.textContent = modules.length;

    completedModules.textContent = modules.filter(module =>
        (module.status || "").toLowerCase() === "completed"
    ).length;

    progressModules.textContent = modules.filter(module =>
        (module.status || "").toLowerCase() === "in progress"
    ).length;

    delayedModules.textContent = modules.filter(module => {

        if (!module.end_date)
            return false;

        return (
            new Date(module.end_date) < new Date() &&
            (module.status || "").toLowerCase() !== "completed"
        );

    }).length;

}
/* ==========================================================
                    ATTACH MODULE EVENTS
========================================================== */

function attachModuleEvents() {

    document.querySelectorAll(".edit-module").forEach(button => {

        button.addEventListener("click", () => {

            openEditModule(button.dataset.id);

        });

    });

    document.querySelectorAll(".delete-module").forEach(button => {

        button.addEventListener("click", () => {

            deleteModule(button.dataset.id);

        });

    });

}

/* ==========================================================
                    FILTER EVENTS
========================================================== */

function attachFilterEvents() {

    moduleSearch.addEventListener("input", applyFilters);

    projectFilter.addEventListener("change", applyFilters);

    statusFilter.addEventListener("change", applyFilters);

    priorityFilter.addEventListener("change", applyFilters);

    resetFilters.addEventListener("click", resetModuleFilters);

}

/* ==========================================================
                    APPLY FILTERS
========================================================== */

function applyFilters() {

    const search = moduleSearch.value.toLowerCase().trim();

    const project = projectFilter.value;

    const status = statusFilter.value.toLowerCase();

    const priority = priorityFilter.value.toLowerCase();

    filteredModules = modules.filter(module => {

        const matchesSearch =

            module.name.toLowerCase().includes(search) ||

            (module.description || "")
                .toLowerCase()
                .includes(search);

        const matchesProject =

            !project ||

            String(module.project_id) === project;

        const matchesStatus =

            !status ||

            (module.status || "")
                .toLowerCase() === status;

        const matchesPriority =

            !priority ||

            (module.priority || "")
                .toLowerCase() === priority;

        return (

            matchesSearch &&
            matchesProject &&
            matchesStatus &&
            matchesPriority

        );

    });

    renderModules();

}

/* ==========================================================
                    RESET FILTERS
========================================================== */

function resetModuleFilters() {

    moduleSearch.value = "";

    projectFilter.value = "";

    statusFilter.value = "";

    priorityFilter.value = "";

    filteredModules = [...modules];

    renderModules();

}

/* ==========================================================
                POPULATE PROJECT FILTER
========================================================== */

function populateProjectFilter() {

    projectFilter.innerHTML = `

        <option value="">
            All Projects
        </option>

    `;

    projects.forEach(project => {

        projectFilter.innerHTML += `

            <option value="${project.id}">

                ${project.name}

            </option>

        `;

    });

}
/* ==========================================================
                    OPEN EDIT MODULE
========================================================== */

function openEditModule(moduleId) {

    const module = modules.find(m => m.id == moduleId);

    if (!module) return;

    editingModuleId = module.id;

    isEditMode = true;

    document.getElementById("moduleName").value =
        module.name || "";

    document.getElementById("moduleDescription").value =
        module.description || "";

    document.getElementById("moduleProject").value =
        module.project_id || "";

    document.getElementById("moduleLead").value =
        module.lead_id || "";

    document.getElementById("modulePriority").value =
        module.priority || "";

    document.getElementById("moduleStatus").value =
        module.status || "";

    document.getElementById("moduleProgress").value =
        module.progress || 0;

    document.getElementById("moduleStartDate").value =
        module.start_date
            ? module.start_date.substring(0, 10)
            : "";

    document.getElementById("moduleEndDate").value =
        module.end_date
            ? module.end_date.substring(0, 10)
            : "";

    document.getElementById("moduleModalTitle").textContent =
        "Edit Module";

    document.getElementById("saveModuleBtn").innerHTML = `
        <i class="bi bi-check-lg me-2"></i>
        Update Module
    `;

    moduleModal.show();

}

/* ==========================================================
                    CREATE MODULE
========================================================== */

async function createModule() {

    const moduleData = {

        name: document.getElementById("moduleName").value.trim(),

        description: document.getElementById("moduleDescription").value.trim(),

        project_id: Number(
            document.getElementById("moduleProject").value
        ),

        lead_id:
            document.getElementById("moduleLead").value || null,

        priority:
            document.getElementById("modulePriority").value,

        status:
            document.getElementById("moduleStatus").value,

        progress:
            Number(
                document.getElementById("moduleProgress").value
            ),

        start_date:
            document.getElementById("moduleStartDate").value || null,

        end_date:
            document.getElementById("moduleEndDate").value || null

    };

    if (!moduleData.name) {

        alert("Please enter a module name.");

        return;

    }

    if (!moduleData.project_id) {

        alert("Please select a project.");

        return;

    }

    try {

        await apiRequest(
            "/modules/",
            "POST",
            moduleData
        );

        moduleModal.hide();

        document.getElementById("moduleForm").reset();

        await loadModules();

        updateStatistics();

        renderModules();

    }

    catch (error) {

        console.error(error);

        alert("Failed to create module.");

    }

}

/* ==========================================================
                    UPDATE MODULE
========================================================== */

async function updateModule() {

    const moduleData = {

        name: document.getElementById("moduleName").value.trim(),

        description: document.getElementById("moduleDescription").value.trim(),

        project_id: Number(
            document.getElementById("moduleProject").value
        ),

        lead_id:
            document.getElementById("moduleLead").value || null,

        priority:
            document.getElementById("modulePriority").value,

        status:
            document.getElementById("moduleStatus").value,

        progress:
            Number(
                document.getElementById("moduleProgress").value
            ),

        start_date:
            document.getElementById("moduleStartDate").value || null,

        end_date:
            document.getElementById("moduleEndDate").value || null

    };

    try {

        await apiRequest(

            `/modules/${editingModuleId}`,

            "PUT",

            moduleData

        );

        moduleModal.hide();

        document.getElementById("moduleForm").reset();

        editingModuleId = null;

        isEditMode = false;

        await loadModules();

        updateStatistics();

        renderModules();

    }

    catch (error) {

        console.error(error);

        alert("Failed to update module.");

    }

}

/* ==========================================================
                    DELETE MODULE
========================================================== */

async function deleteModule(moduleId) {

    const confirmed = confirm(
        "Are you sure you want to delete this module?"
    );

    if (!confirmed) return;

    try {

        await apiRequest(

            `/modules/${moduleId}`,

            "DELETE"

        );

        await loadModules();

        updateStatistics();

        renderModules();

    }

    catch (error) {

        console.error(error);

        alert("Failed to delete module.");

    }

}

/* ==========================================================
                    HELPERS
========================================================== */

// ==========================================================
// POPULATE PROJECT DROPDOWN
// ==========================================================

function populateProjectDropdown() {

    const select = document.getElementById("moduleProject");

    select.innerHTML = `
        <option value="">
            Select Project
        </option>
    `;

    projects.forEach(project => {

        select.innerHTML += `
            <option value="${project.id}">
                ${project.name}
            </option>
        `;

    });

}

// ==========================================================
// POPULATE LEAD DROPDOWN
// ==========================================================

function populateLeadDropdown() {

    const select = document.getElementById("moduleLead");

    if (!select) return;

    select.innerHTML = `
        <option value="">
            Select Lead
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

// ==========================================================
// FORMAT DATE
// ==========================================================

function formatDate(date) {

    if (!date)
        return "-";

    return new Date(date).toLocaleDateString("en-IN");

}

// ==========================================================
// STATUS BADGE
// ==========================================================

function renderStatusBadge(status) {

    const value = (status || "").toLowerCase();

    let cls = "bg-secondary";

    if (value === "completed")
        cls = "bg-success";

    else if (value === "in progress")
        cls = "bg-primary";

    else if (value === "planning")
        cls = "bg-info text-dark";

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

// ==========================================================
// PRIORITY BADGE
// ==========================================================

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