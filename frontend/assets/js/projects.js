loadSidebar("projects.html");

initializeTopbar({
    page: "Projects",
    subtitle: "Manage all company software projects",
    newButtonText: "New Project",
    newButtonId: "topbarNewProject"
});

document
    .getElementById("topbarNewProject")
    ?.addEventListener("click", () => {

        editingProjectId = null;

        document.getElementById("projectForm").reset();

        document.querySelector("#addProjectModal .modal-title").textContent =
            "Add Project";
        document.getElementById("saveProjectBtn").textContent =
    "Save Project";    

        const modal = new bootstrap.Modal(
            document.getElementById("addProjectModal")
        );

        modal.show();

    });

let editingProjectId = null;

const urlParams = new URLSearchParams(window.location.search);

const autoEditProjectId = urlParams.get("edit");

let allProjects = [];
let allClients = [];
let allEmployees = [];

/* ===========================
   Helper Functions
=========================== */

function getClientName(clientId) {

    const client = allClients.find(c => c.id === clientId);

    if (!client) return `Client #${clientId}`;

    return client.company_name || client.name || `Client #${clientId}`;

}

function getManagerName(managerId) {

    if (!managerId) return "-";

    const employee = allEmployees.find(e => e.id === managerId);

    if (!employee) {
        return `Manager ${managerId}`;
    }

    return employee.full_name;

}

function getProjectProgress(project) {

    switch (project.status) {

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

function getStatusClass(status) {

    switch (status) {

        case "Completed":
            return "success";

        case "Planning":
            return "warning";

        case "In Progress":
            return "primary";

        case "Delayed":
            return "danger";

        default:
            return "secondary";

    }

}

function updateProjectStatistics(projects) {

    const active = projects.filter(
        p => p.status === "In Progress"
    ).length;

    const completed = projects.filter(
        p => p.status === "Completed"
    ).length;

    const planning = projects.filter(
        p => p.status === "Planning"
    ).length;

    const delayed = projects.filter(project => {

        if (!project.end_date) return false;

        if (project.status === "Completed") return false;

        return new Date(project.end_date) < new Date();

    }).length;

    document.getElementById("activeProjects").textContent = active;
    document.getElementById("completedProjects").textContent = completed;
    document.getElementById("planningProjects").textContent = planning;
    document.getElementById("delayedProjects").textContent = delayed;

}

function getPriorityClass(priority) {

    switch (priority) {

        case "High":
            return "danger";

        case "Medium":
            return "warning";

        case "Low":
            return "success";

        default:
            return "secondary";

    }

}

function getDeadlineClass(project) {

    if (!project.end_date) {
        return "";
    }

    if (project.status === "Completed") {
        return "text-success fw-semibold";
    }

    const today = new Date();
    const deadline = new Date(project.end_date);

    if (deadline < today) {
        return "text-danger fw-bold";
    }

    return "text-dark";

}

function getProgressBarClass(status) {

    switch (status) {

        case "Completed":
            return "bg-success";

        case "Planning":
            return "bg-warning";

        case "In Progress":
            return "bg-primary";

        case "Delayed":
            return "bg-danger";

        default:
            return "bg-secondary";

    }

}

function renderProjects(projects) {

    const table = document.getElementById("projectTable");

    table.innerHTML = "";

    if (projects.length === 0) {

    table.innerHTML = `

    <tr>

        <td colspan="8" class="text-center py-5">

            <i class="bi bi-folder2-open display-4 text-secondary"></i>

            <h5 class="mt-3 mb-2">

                No Projects Found

            </h5>

            <p class="text-muted mb-0">

                Try changing your search or filters.

            </p>

        </td>

    </tr>

    `;

    return;

}

    projects.forEach(project => {

        const progress = getProjectProgress(project);

        table.innerHTML += `

<tr>

    <td>

        <div class="project-name">

            <div class="project-icon">
                <i class="bi bi-kanban-fill"></i>
            </div>

            <div>
<a
    href="project-details.html?id=${project.id}"
    class="text-decoration-none fw-bold text-dark">
    ${project.name}
</a>                <small>${project.description || "Software Project"}</small>
            </div>

        </div>

    </td>

    <td>

        ${getClientName(project.client_id)}

    </td>

    <td>

        <div class="d-flex align-items-center gap-2">

            <img
    src="https://ui-avatars.com/api/?name=${encodeURIComponent(getManagerName(project.manager_id))}&background=4F46E5&color=ffffff&rounded=true&size=64"
    class="manager-avatar"
    alt="${getManagerName(project.manager_id)}">

            ${getManagerName(project.manager_id)}

        </div>

    </td>

    <td>

        <span class="badge bg-${getPriorityClass(project.priority)}">

    ${project.priority}

</span>

    </td>

    <td>

        <span class="status-badge ${getStatusClass(project.status)}">

            ${project.status}

        </span>

    </td>

    <td style="width:180px;">

        <div class="progress">

            <div
    class="progress-bar ${getProgressBarClass(project.status)}"
    style="width:${progress}%">

        </div>

        <small>${progress}%</small>

    </td>

    <td class="${getDeadlineClass(project)}">

    ${project.end_date ?? "-"}

</td>

<td>

    <div class="d-flex gap-2">

        <button
            class="btn btn-outline-secondary btn-sm"
            onclick="window.location.href='project-details.html?id=${project.id}'">

            <i class="bi bi-eye"></i>

        </button>

        <button
            class="btn btn-outline-primary btn-sm"
            onclick="editProject(${project.id})">

            <i class="bi bi-pencil"></i>

        </button>

        <button
            class="btn btn-outline-danger btn-sm"
            onclick="deleteProject(${project.id})">

            <i class="bi bi-trash"></i>

        </button>

    </div>

</td>

</tr>

`;

    });

}

/* ===========================
   Load Projects
=========================== */

function populateProjectDropdowns() {

    const clientSelect = document.getElementById("client_id");
    const managerSelect = document.getElementById("manager_id");

    if (!clientSelect || !managerSelect) return;

    clientSelect.innerHTML = `
        <option value="">Select Client</option>
    `;

    managerSelect.innerHTML = `
        <option value="">Select Project Manager</option>
    `;

    allClients.forEach(client => {

        clientSelect.innerHTML += `
            <option value="${client.id}">
                ${client.company_name || client.name}
            </option>
        `;

    });

    allEmployees.forEach(employee => {

        managerSelect.innerHTML += `
            <option value="${employee.id}">
                ${employee.full_name}
            </option>
        `;

    });

}

async function loadProjects() {

    try {

        allProjects = await apiRequest("/projects/");
        allClients = await apiRequest("/clients/");
        allEmployees = await apiRequest("/employees/");
        populateProjectDropdowns();

        console.log("Employee 1 =", allEmployees.find(e => e.id === 1));

        updateProjectStatistics(allProjects);

        renderProjects(allProjects);

    }

    catch (error) {

        console.error("Unable to load projects:", error);

        alert("Unable to load projects.");

    }

}

/* ===========================
   Search Projects
=========================== */

function filterProjects() {

    const searchText = document
        .getElementById("projectSearch")
        .value
        .trim()
        .toLowerCase();

        const status = document.getElementById("statusFilter").value;

const priority = document.getElementById("priorityFilter").value;

    const filteredProjects = allProjects.filter(project => {

        const matchesSearch =

    project.name.toLowerCase().includes(searchText) ||

    (project.description || "")
        .toLowerCase()
        .includes(searchText) ||

    getClientName(project.client_id)
        .toLowerCase()
        .includes(searchText) ||

    getManagerName(project.manager_id)
        .toLowerCase()
        .includes(searchText);

const matchesStatus =

    status === "" ||

    project.status === status;

const matchesPriority =

    priority === "" ||

    project.priority === priority;

return matchesSearch && matchesStatus && matchesPriority;

    });

    updateProjectStatistics(filteredProjects);

    renderProjects(filteredProjects);

}

/* ===========================
   Edit Project
=========================== */

async function editProject(projectId) {

    editingProjectId = projectId;

    try {

        const project = await apiRequest(`/projects/${projectId}`);

        document.getElementById("name").value = project.name;
        document.getElementById("description").value = project.description || "";
        document.getElementById("client_id").value = project.client_id;
        document.getElementById("manager_id").value = project.manager_id || "";
        document.getElementById("priority").value = project.priority;
        document.getElementById("status").value = project.status;
        document.getElementById("start_date").value = project.start_date || "";
        document.getElementById("end_date").value = project.end_date || "";
        document.querySelector("#addProjectModal .modal-title").textContent =
    "Edit Project";
        document.getElementById("saveProjectBtn").textContent =
    "Update Project";

        const modal = new bootstrap.Modal(
            document.getElementById("addProjectModal")
        );

        modal.show();

    }

    catch (error) {

        console.error(error);

        alert("Unable to load project.");

    }

}

/* ===========================
   Delete Project
=========================== */

async function deleteProject(projectId) {

    if (!confirm("Are you sure you want to delete this project?")) {
        return;
    }

    try {

        await apiRequest(`/projects/${projectId}`, "DELETE");

        alert("Project deleted successfully.");

        await loadProjects();

    }

    catch (error) {

        console.error(error);

        alert("Unable to delete project.");

    }

}

/* ===========================
   Project Form
=========================== */

const projectForm = document.getElementById("projectForm");

projectForm.addEventListener("submit", async function (e) {

    e.preventDefault();

    const project = {

        name: document.getElementById("name").value,

        description: document.getElementById("description").value,

        client_id: parseInt(document.getElementById("client_id").value),

        manager_id: document.getElementById("manager_id").value
            ? parseInt(document.getElementById("manager_id").value)
            : null,

        priority: document.getElementById("priority").value,

        status: document.getElementById("status").value,

        start_date: document.getElementById("start_date").value || null,

        end_date: document.getElementById("end_date").value || null

    };

  try {

    const updatedProjectId = editingProjectId;

    if (editingProjectId === null) {

        await apiRequest("/projects/", "POST", project);

        alert("Project Added Successfully!");

    }

    else {

        await apiRequest(
            `/projects/${updatedProjectId}`,
            "PUT",
            project
        );

        alert("Project Updated Successfully!");

        editingProjectId = null;

    }

    projectForm.reset();

bootstrap.Modal
    .getInstance(document.getElementById("addProjectModal"))
    ?.hide();

if (autoEditProjectId) {

    window.location.href =
        `project-details.html?id=${updatedProjectId}`;

    return;

}

await loadProjects();

    }

    catch (error) {

        console.error(error);

        alert("Unable to save project.");

    }

});

/* ===========================
   Event Listeners
=========================== */

const projectSearch = document.getElementById("projectSearch");

if (projectSearch) {

    projectSearch.addEventListener("input", filterProjects);

}
const statusFilter = document.getElementById("statusFilter");

if (statusFilter) {

    statusFilter.addEventListener("change", filterProjects);

}

const priorityFilter = document.getElementById("priorityFilter");

if (priorityFilter) {

    priorityFilter.addEventListener("change", filterProjects);

}
const clearFilters = document.getElementById("clearFilters");

if (clearFilters) {

    clearFilters.addEventListener("click", function () {

        document.getElementById("projectSearch").value = "";

        document.getElementById("statusFilter").value = "";

        document.getElementById("priorityFilter").value = "";

        updateProjectStatistics(allProjects);

        renderProjects(allProjects);

    });

}

/* ===========================
   Initial Load
=========================== */

(async () => {

    await loadProjects();

    if (autoEditProjectId) {

        await editProject(Number(autoEditProjectId));

    }

})();