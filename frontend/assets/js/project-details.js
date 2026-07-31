/* ==========================================
   ScriptFlow PMS
   Project Details
========================================== */

const params = new URLSearchParams(window.location.search);
const projectId = params.get("id");

if (!projectId) {

    alert("Invalid Project.");

    window.location.href = "projects.html";

}

let project = null;
let client = null;
let manager = null;
let recentTasks = [];
const uploadFileBtn = document.getElementById("uploadFileBtn");
const uploadModuleSelect = document.getElementById("uploadModuleSelect");
const projectFileInput = document.getElementById("projectFileInput");
const confirmUploadBtn = document.getElementById("confirmUploadBtn");

/* ==========================================
   Helpers
========================================== */

function calculateProgress(status) {

    switch (status) {

        case "Completed":
            return 100;

        case "In Progress":
            return 65;

        case "Planning":
            return 20;

        default:
            return 0;

    }

}


function daysRemaining(endDate) {

    if (!endDate) return "-";

    const today = new Date();

    const end = new Date(endDate);

    const diff = end - today;

    return Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)), 0);

}


/* ==========================================
   UI
========================================== */

function populateProject() {

    document.getElementById("pageProjectName").textContent =
        project.name;


    document.getElementById("projectDescription").textContent =
        project.description || "No description available.";

    document.getElementById("projectStatus").textContent =
        project.status;

    document.getElementById("projectPriority").textContent =
        project.priority;

    document.getElementById("projectStartDate").textContent =
        project.start_date || "-";

    document.getElementById("projectEndDate").textContent =
        project.end_date || "-";

    document.getElementById("projectClient").textContent =
        client.company_name;
        const heroClient = document.getElementById("heroProjectClient");

if (heroClient) {

    heroClient.textContent = client.company_name;

}

    if (manager) {

    document.getElementById("projectManager").textContent =
        manager.full_name;

        const heroManager = document.getElementById("heroProjectManager");

if (heroManager) {

    heroManager.textContent = manager.full_name;

}

}

else {

    document.getElementById("projectManager").textContent = "-";

    const heroManager = document.getElementById("heroProjectManager");

if (heroManager) {

    heroManager.textContent = "-";

}

}

    const progress = calculateProgress(project.status);

    document.getElementById("projectProgress").textContent =
        `${progress}%`;

    document.getElementById("projectProgressBar").style.width =
        `${progress}%`;

    document.getElementById("projectProgressText").textContent =
        `${progress}% Completed`;

    // document.getElementById("daysLeft").textContent =
    //     daysRemaining(project.end_date);

}


async function openUploadFileModal() {

    try {

        const modules = await apiRequest(
            `/modules/project/${projectId}`
        );

        uploadModuleSelect.innerHTML = `
            <option value="">
                Select Module
            </option>
        `;

        modules.forEach(module => {

            uploadModuleSelect.innerHTML += `
                <option value="${module.id}">
                    ${module.name}
                </option>
            `;

        });

        projectFileInput.value = "";

        const modal = new bootstrap.Modal(
            document.getElementById("uploadFileModal")
        );

        modal.show();

    }

    catch (error) {

        console.error(error);

        alert("Failed to load project modules.");

    }

}

async function uploadProjectFile() {

    const moduleId = uploadModuleSelect.value;
    const file = projectFileInput.files[0];

    if (!moduleId) {

        alert("Please select a module.");
        return;

    }

    if (!file) {

        alert("Please choose a file.");
        return;

    }

    try {

        const formData = new FormData();

        formData.append("module_id", moduleId);

        // Current logged-in user
        

        formData.append(
            "file",
            file
        );

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

            throw new Error(
                "Upload failed."
            );

        }

        bootstrap.Modal.getInstance(

            document.getElementById(
                "uploadFileModal"
            )

        ).hide();

        alert("File uploaded successfully!");

        await loadProjectFiles();

    }

    catch (error) {

        console.error(error);

        alert("Failed to upload file.");

    }

}

async function loadProjectFiles() {

    const container = document.getElementById("projectFilesList");

    if (!container) return;

    container.innerHTML = `
        <div class="text-center py-4 text-muted">
            Loading files...
        </div>
    `;

    try {

        const files = await apiRequest(
            `/files/project/${projectId}`
        );

        if (files.length === 0) {

            container.innerHTML = `
                <div class="text-center py-4 text-muted">
                    No files uploaded yet.
                </div>
            `;

            return;

        }

        container.innerHTML = "";

        files.forEach(file => {

            container.innerHTML += `

<div class="d-flex justify-content-between align-items-center border rounded p-3 mb-3">

    <div>

        <h6 class="mb-1">

            <i class="bi bi-file-earmark me-2"></i>

            ${file.original_filename}

        </h6>

        <small class="text-muted">

            ${file.file_size} bytes

        </small>

    </div>

    <div>

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

`;

        });

        attachProjectFileEvents();

    }

    catch (error) {

        console.error(error);

        container.innerHTML = `
            <div class="text-danger text-center py-4">
                Failed to load project files.
            </div>
        `;

    }

}

function attachProjectFileEvents() {

    document.querySelectorAll(".download-file-btn").forEach(button => {

        button.addEventListener("click", () => {

            const fileId = button.dataset.id;

            window.open(
                `${API_BASE_URL}/files/download/${fileId}`,
                "_blank"
            );

        });

    });

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

                await loadProjectFiles();

                alert("File deleted successfully.");

            }

            catch (error) {

                console.error(error);

                alert("Failed to delete file.");

            }

        });

    });

}


/* ==========================================
   Load Data
========================================== */

async function loadProjectDetails() {

    try {

        // Load Project
        console.log("Loading project...");
project = await apiRequest(`/projects/${projectId}`);
console.log(project);

        // Load Client
        console.log("Loading client...");
client = await apiRequest(`/clients/${project.client_id}`);
console.log(client);

        // Load Manager (if assigned)
        if (project.manager_id) {

            console.log("Loading manager...");
manager = await apiRequest(`/employees/${project.manager_id}`);

console.log("Manager object:");
console.log(manager);
console.log(JSON.stringify(manager, null, 2));

        }
        // Load Project Tasks
console.log("Loading project tasks...");

const allTasks = await apiRequest("/tasks/");

recentTasks = allTasks.filter(
    task => task.project_id == projectId
);

console.log(recentTasks);

        populateProject();

loadTeamMembers();

await loadRecentActivity();

        /* ===============================
           Placeholder Statistics
           (Will become dynamic after
           Tasks & Teams module)
        =============================== */

    document.getElementById("totalTasks").textContent =
    recentTasks.length;

document.getElementById("completedTasks").textContent =
    recentTasks.filter(
        task => task.status === "Completed"
    ).length;

document.getElementById("teamMembers").textContent =
    manager ? 1 : 0;

    }

    catch (error) {

    console.error("Project Details Error:", error);

    alert("Unable to load project details.");

    // window.location.href = "projects.html";

}

}


/* ==========================================
   Buttons
========================================== */

const editProjectBtn = document.getElementById("editProjectBtn");

if (editProjectBtn) {

    editProjectBtn.addEventListener("click", () => {

        window.location.href =
            `projects.html?edit=${projectId}`;

    });

}


const addModuleBtn = document.getElementById("addModuleBtn");
const createModuleBtn = document.getElementById("createModuleBtn");
const assignEmployeeBtn = document.getElementById("assignEmployeeBtn");
const assignEmployeeSaveBtn = document.getElementById("assignEmployeeSaveBtn");

function openModuleModal() {

    const modal = new bootstrap.Modal(
        document.getElementById("moduleModal")
    );

    modal.show();

}

if (addModuleBtn) {

    addModuleBtn.addEventListener("click", openModuleModal);

}


if (createModuleBtn) {

    createModuleBtn.addEventListener("click", openModuleModal);

}
async function openAssignEmployeeModal() {

    const select = document.getElementById("employeeSelect");

    select.innerHTML = `
        <option value="">
            Loading employees...
        </option>
    `;

    try {

        const employees = await apiRequest("/employees/");

        select.innerHTML = `
            <option value="">
                Select an employee
            </option>
        `;

        employees.forEach(employee => {

            select.innerHTML += `
                <option value="${employee.id}">
                    ${employee.full_name} (${employee.employee_code})
                </option>
            `;

        });

    }

    catch (error) {

        console.error(error);

        select.innerHTML = `
            <option value="">
                Failed to load employees
            </option>
        `;

    }

    const modal = new bootstrap.Modal(
        document.getElementById("assignEmployeeModal")
    );

    modal.show();

}
async function assignEmployee() {

    console.log("Assign button clicked");

    const select = document.getElementById("employeeSelect");

    if (!select.value) {

        alert("Please select an employee.");

        return;

    }

    try {

        await apiRequest(
    `/projects/${projectId}/team`,
    "POST",
    {
        user_id: Number(select.value)
    }
);

        bootstrap.Modal.getInstance(
            document.getElementById("assignEmployeeModal")
        ).hide();

        alert("Employee assigned successfully!");

        await loadTeamMembers();

    }

    catch (error) {

        console.error(error);

        alert("Failed to assign employee.");

    }

}

if (assignEmployeeBtn) {

    assignEmployeeBtn.addEventListener(
        "click",
        openAssignEmployeeModal
    );

}
if (assignEmployeeSaveBtn) {

    assignEmployeeSaveBtn.addEventListener(
        "click",
        assignEmployee
    );

}
if (uploadFileBtn) {

    uploadFileBtn.addEventListener(
        "click",
        openUploadFileModal
    );

}
if (confirmUploadBtn) {

    confirmUploadBtn.addEventListener(
        "click",
        uploadProjectFile
    );

}


/* ==========================================
   Future Sections
========================================== */

async function loadTeamMembers() {

    const container = document.getElementById("teamGrid");

    if (!container) return;

    container.innerHTML = `
        <div class="text-center py-5 text-muted">
            Loading team...
        </div>
    `;

    try {

        const members = await apiRequest(
            `/projects/${projectId}/team`
        );

        document.getElementById("teamMembers").textContent =
            members.length;

        if (members.length === 0) {

            container.innerHTML = `
                <div class="text-center py-5 text-muted">

                    <i class="bi bi-people fs-1"></i>

                    <h4 class="mt-3">
                        No Team Members
                    </h4>

                    <p>
                        Employees assigned to this project will appear here.
                    </p>

                </div>
            `;

            return;

        }

        container.innerHTML = "";

        members.forEach(member => {

    container.innerHTML += `

<div class="col-lg-4 col-md-6">

    <div class="team-member-card text-center">

        <div class="team-avatar">
            ${member.full_name.charAt(0)}
        </div>

        <div class="team-name">
            ${member.full_name}
        </div>

        <div class="team-role">
            ${member.designation || "-"}
        </div>

        <span class="team-status">
            Active
        </span>

        <div class="team-info-item">
            <i class="bi bi-building"></i>
            <span>${member.department || "-"}</span>
        </div>

        <div class="team-info-item">
            <i class="bi bi-envelope"></i>
            <span>${member.email || "-"}</span>
        </div>

        <div class="team-info-item">
            <i class="bi bi-telephone"></i>
            <span>${member.phone || "-"}</span>
        </div>

        <div class="team-info-item">
            <i class="bi bi-person-badge"></i>
            <span>${member.employee_code || "-"}</span>
        </div>

        <button
            class="btn btn-outline-danger w-100 team-remove-btn remove-member-btn"
            data-user="${member.id}">

            <i class="bi bi-trash me-2"></i>

            Remove Employee

        </button>

    </div>

</div>

`;

        });

    }

    catch (error) {

        console.error(error);

        container.innerHTML = `
            <div class="text-center text-danger py-5">
                Failed to load team members.
            </div>
        `;

    }

}

async function loadRecentActivity() {

    const container = document.getElementById("activityTimeline");

    if (!container) return;

    container.innerHTML = "";

    try {

        const tasks = await apiRequest("/tasks/");

const recentTasks = tasks
    .filter(task => task.project_id == project.id)
            .sort((a, b) =>
                new Date(b.updated_at) - new Date(a.updated_at)
            )
            .slice(0, 5);

        if (recentTasks.length === 0) {

            container.innerHTML = `
                <div class="text-center text-muted py-4">
                    No recent activity available.
                </div>
            `;

            return;

        }

        recentTasks.forEach(task => {

            container.innerHTML += `
<div class="d-flex align-items-start gap-3 py-3 border-bottom">

    <div class="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
         style="width:40px;height:40px;">

        <i class="bi bi-check2-circle"></i>

    </div>

    <div class="flex-grow-1">

        <div class="fw-semibold">
            ${task.title}
        </div>

        <div class="text-muted small">
            Status updated to
            <strong>${task.status}</strong>
        </div>

        <div class="text-muted small">
            ${new Date(task.updated_at).toLocaleString()}
        </div>

    </div>

</div>
`;

        });

    }

    catch (error) {

        console.error(error);

    }

}

async function loadTimeline() {

    const container = document.getElementById("timelineContainer");

    if (!container) return;

    container.innerHTML = `
        <div class="text-center py-5">
            Loading timeline...
        </div>
    `;

    try {

        const timeline = await apiRequest(
            `/projects/${projectId}/timeline`
        );

        const {
            project,
            modules,
            tasks
        } = timeline;

        container.innerHTML = "";

        // ===========================
        // Project
        // ===========================

        container.innerHTML += `

<div class="timeline-item project">

    <div class="timeline-dot bg-primary"></div>

    <div class="timeline-content">

        <h5 class="mb-2">

            <i class="bi bi-folder2-open me-2"></i>

            ${project.name}

        </h5>

        <div class="text-muted">

            ${project.start_date || "-"}
            →
            ${project.end_date || "-"}

        </div>

        <div class="progress mt-3">

            <div
                class="progress-bar"
                style="width:${project.progress}%">

            </div>

        </div>

    </div>

</div>

`;

        // ===========================
        // Modules
        // ===========================

        modules.forEach(module => {

            container.innerHTML += `

<div class="timeline-item module">

    <div class="timeline-dot bg-success"></div>

    <div class="timeline-content">

        <div class="d-flex justify-content-between">

            <h6>

                <i class="bi bi-box-seam me-2"></i>

                ${module.name}

            </h6>

            <span class="badge bg-primary">

                ${module.status}

            </span>

        </div>

        <small class="text-muted">

            ${module.start_date || "-"}
            →
            ${module.end_date || "-"}

        </small>

    </div>

</div>

`;

        });

        // ===========================
        // Tasks
        // ===========================

        tasks.forEach(task => {

            container.innerHTML += `

<div class="timeline-item task">

    <div class="timeline-dot bg-warning"></div>

    <div class="timeline-content">

        <div class="d-flex justify-content-between">

            <strong>

                ${task.title}

            </strong>

            <span class="badge bg-secondary">

                ${task.status}

            </span>

        </div>

        <small class="text-muted">

            ${task.start_date || "-"}
            →
            ${task.due_date || "-"}

        </small>

    </div>

</div>

`;

        });

    }

    catch (error) {

        console.error(error);

        container.innerHTML = `

<div class="text-center text-danger py-5">

    Failed to load timeline.

</div>

`;

    }

}

/* ==========================================================
   PROJECT WORKSPACE TABS
========================================================== */

const workspaceTabs = document.querySelectorAll(".workspace-tab");

const sections = {
    overview: document.getElementById("overviewSection"),
    modules: document.getElementById("modulesSection"),
    team: document.getElementById("teamSection"),
    timeline: document.getElementById("timelineSection"),
    files: document.getElementById("filesSection"),
    activity: document.getElementById("activitySection")
};

workspaceTabs.forEach(tab => {

    tab.addEventListener("click", () => {

        console.log("Clicked:", tab.dataset.section);

        // Remove active class
        workspaceTabs.forEach(t => t.classList.remove("active"));

        // Add active class
        tab.classList.add("active");

        // Hide all sections
Object.values(sections).forEach(section => {

    if (section) {

        section.classList.add("d-none");

    }

});

// Show selected section
const target = tab.dataset.section;

if (sections[target]) {

    sections[target].classList.remove("d-none");

    if (target === "modules") {

    loadModuleCards();

    } 

    if (target === "timeline") {

    loadTimeline();

    }

}
    });

});

/* ==========================================================
   PROJECT WORKSPACE TABS
========================================================== */

console.log("Workspace JS Loaded");

/* ==========================================================
   MODULE CARDS (Demo)
========================================================== */

async function loadModuleCards() {

    const grid = document.getElementById("modulesGrid");

    if (!grid) return;

    try {

 const modules = await apiRequest(
    `/modules/project/${projectId}`
);

grid.innerHTML = "";

// Update overview statistics
const totalModules = document.getElementById("totalModules");

if (totalModules) {

    totalModules.textContent = modules.length;

}

/* ---------- ADD THE NEW CODE HERE ---------- */

const recentModulesList = document.getElementById("recentModulesList");

if (recentModulesList) {

    if (modules.length === 0) {

        recentModulesList.innerHTML = `
            <div class="text-center py-4 text-muted">
                No modules available.
            </div>
        `;

    } else {

        recentModulesList.innerHTML = "";

        modules
            .slice(0, 5)
            .forEach(module => {

                recentModulesList.innerHTML += `
                    <div class="d-flex justify-content-between align-items-center border-bottom py-3">

                        <div>
                            <div class="fw-semibold">${module.name}</div>
                            <small class="text-muted">${module.status}</small>
                        </div>

                        <span class="badge bg-primary">
                            ${module.progress}%
                        </span>

                    </div>
                `;

            });

    }

}


    if (modules.length === 0) {

        grid.innerHTML = `
            <div class="col-12 text-center py-5 text-muted">
                No modules created yet.
            </div>
        `;

        return;
    }

    grid.innerHTML = "";

    modules.forEach(module => {

        grid.innerHTML += `
            <div class="col-lg-4 col-md-6">

                <div class="module-card p-4 h-100">

                        <div class="d-flex align-items-center mb-3">

    <div class="module-icon">

        <i class="bi bi-box-seam"></i>

    </div>

    <div class="ms-3">

        <h5 class="fw-bold mb-0">

            ${module.name}

        </h5>

        <small class="text-muted">

            Software Module

        </small>

    </div>

</div>

                        <div class="progress mb-3" style="height:8px;">

                            <div
                                class="progress-bar"
                                style="width:${module.progress}%">

                            </div>

                        </div>

                        <div class="small text-muted mb-2">
                            Progress: ${module.progress}%
                        </div>

                        <div class="row text-center my-3">

    <div class="col">

    <div class="fw-bold">-</div>
        <div class="module-stat">Tasks</div>

    </div>

    <div class="col">

        <div class="fw-bold">-</div>

        <div class="module-stat">Members</div>

    </div>

    <div class="col">

    <div class="fw-bold">${module.end_date || "-"}</div>

    <div class="module-stat">Due</div>

    </div>

</div>

                      <div class="module-footer d-flex justify-content-between align-items-center">

    <span class="badge bg-danger">

        ${module.priority}

    </span>

    <a
    href="module-details.html?id=${module.id}"
    class="btn btn-primary btn-sm">

    Open Module

</a>

</div>

                </div>

            </div>
        `;

    });

    }

    catch (error) {

        console.error(error);

        grid.innerHTML = `
            <div class="col-12 text-center text-danger py-5">
                Failed to load modules.
            </div>
        `;

    }

}

/* ==========================================================
   CREATE MODULE
========================================================== */

const saveModuleBtn = document.getElementById("saveModuleBtn");

if (saveModuleBtn) {

    saveModuleBtn.addEventListener("click", createModule);

}

async function createModule() {

    try {

        const moduleData = {

            project_id: Number(projectId),

            name: document.getElementById("moduleName").value.trim(),

            description: document.getElementById("moduleDescription").value.trim(),

            status: document.getElementById("moduleStatus").value,

            priority: document.getElementById("modulePriority").value,

            start_date:
                document.getElementById("moduleStartDate").value || null,

            end_date:
                document.getElementById("moduleDeadline").value || null,

            lead_id: null

        };

        if (!moduleData.name) {

            alert("Module name is required.");

            return;

        }

        await apiRequest(
    "/modules/",
    "POST",
    moduleData
);

        const modal =
    bootstrap.Modal.getInstance(
        document.getElementById("moduleModal")
    );

if (modal) {

    modal.hide();

}

alert("Module created successfully!");

await loadModuleCards();

document.getElementById("moduleName").value = "";
document.getElementById("moduleDescription").value = "";
document.getElementById("moduleStatus").value = "Planning";
document.getElementById("modulePriority").value = "Medium";
document.getElementById("moduleProgress").value = 0;
document.getElementById("moduleStartDate").value = "";
document.getElementById("moduleDeadline").value = "";


    }

    catch (error) {

        console.error(error);

        alert("Failed to create module.");

    }

}
/* ==========================================
   Initialize Page
========================================== */

document.addEventListener("DOMContentLoaded", async () => {

    loadSidebar("projects");

    loadTopbar({
        page: "Project Workspace",
        subtitle: "Manage project workspace"
    });

    await loadProjectDetails();

    await loadModuleCards();

    await loadProjectFiles();

});