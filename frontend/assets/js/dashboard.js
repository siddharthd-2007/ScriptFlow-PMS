// ======================================================
// ScriptFlow PMS Dashboard
// ======================================================


// ======================================================
// Greeting
// ======================================================
document.addEventListener("DOMContentLoaded", async () => {

    loadSidebar("dashboard");

    initializeTopbar({
        page: "Dashboard",
        subtitle: "Monitor projects, teams and overall performance"
    });

    await loadDashboard();

});


// ======================================================
// Load Dashboard
// ======================================================


async function loadDashboard() {

    try {

       const data = await apiRequest("/dashboard/");

        populateStats(data.stats);

        populateProjects(data.attention_projects);

        populateClients(data.recent_clients);

        populateDeadlines(data.upcoming_deadlines);

        populateWorkload(data.employee_workload);

    }

    catch (error) {

        console.error(error);

    }

}
// ======================================================
// Statistics
// ======================================================

function populateStats(stats) {

    document.getElementById("totalProjects").textContent =
        stats.total_projects;

    document.getElementById("activeProjects").textContent =
        stats.active_projects;

    document.getElementById("totalClients").textContent =
        stats.total_clients;

    document.getElementById("totalEmployees").textContent =
        stats.total_employees;

    document.getElementById("totalTasks").textContent =
        stats.total_tasks;

    document.getElementById("delayedProjects").textContent =
        stats.delayed_projects;

}

// ======================================================
// Projects Requiring Attention
// ======================================================

function populateProjects(projects) {

    const table = document.getElementById("attentionProjectsTable");

    if (!table) return;

    table.innerHTML = "";

    if (projects.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="7" class="text-center py-5">

                    <i class="bi bi-folder2-open fs-1 text-muted"></i>

                    <p class="mt-3 mb-0">

                        No projects found.

                    </p>

                </td>
            </tr>
        `;

        return;

    }

    projects.forEach(project => {

        table.innerHTML += `

        <tr onclick="location.href='project-details.html?id=${project.id}'">

            <td>

                <div class="project-name">

                    <div class="project-icon">

                        <i class="bi bi-kanban-fill"></i>

                    </div>

                    <div>

                        <strong>${project.name}</strong>

                    </div>

                </div>

            </td>

            <td>

                ${project.client}

            </td>

            <td>

                ${project.manager}

            </td>

            <td>

                <span class="${getStatusClass(project.status)}">

                    ${project.status}

                </span>

            </td>

            <td>

                <span class="${getPriorityClass(project.priority)}">

                    ${project.priority}

                </span>

            </td>

            <td>

                <div class="progress">

                    <div
                        class="progress-bar ${getProgressColor(project.progress)}"
                        style="width:${project.progress}%">

                    </div>

                </div>

                <small>

                    ${project.progress}%

                </small>

            </td>

            <td>

                ${project.deadline}

            </td>

        </tr>

        `;

    });

}

// ======================================================
// Status Badge Helper
// ======================================================

function getStatusClass(status) {

    switch (status.toLowerCase()) {

        case "completed":
            return "status-badge success";

        case "in progress":
            return "status-badge success";

        case "planning":
            return "status-badge warning";

        case "testing":
            return "status-badge warning";

        case "delayed":
            return "status-badge danger";

        default:
            return "status-badge";

    }

}

// ======================================================
// Priority Badge Helper
// ======================================================

function getPriorityClass(priority) {

    switch (priority.toLowerCase()) {

        case "critical":
            return "priority critical";

        case "high":
            return "priority high";

        case "medium":
            return "priority medium";

        case "low":
            return "priority low";

        default:
            return "priority medium";

    }

}

// ======================================================
// Progress Bar Color
// ======================================================

function getProgressColor(progress) {

    if (progress >= 80)
        return "bg-success";

    if (progress >= 50)
        return "bg-warning";

    return "bg-danger";

}

// ======================================================
// Recently Added Clients
// ======================================================

function populateClients(clients) {

    const table = document.getElementById("recentClientsTable");

    if (!table) return;

    table.innerHTML = "";

    if (clients.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="4" class="text-center py-5">

                    <i class="bi bi-buildings fs-1 text-muted"></i>

                    <p class="mt-3 mb-0">

                        No clients found.

                    </p>

                </td>
            </tr>
        `;

        return;

    }

    clients.forEach(client => {

        table.innerHTML += `

            <tr>

                <td>

                    <strong>${client.company}</strong>

                </td>

                <td>

                    ${client.industry}

                </td>

                <td>

                    ${client.projects}

                </td>

                <td>

                    <span class="${getClientStatus(client.status)}">

                        ${client.status}

                    </span>

                </td>

            </tr>

        `;

    });

}

// ======================================================
// Upcoming Deadlines
// ======================================================

function populateDeadlines(deadlines) {

    const container = document.getElementById("upcomingDeadlines");

    if (!container) return;

    container.innerHTML = "";

    if (deadlines.length === 0) {

        container.innerHTML = `

            <div class="text-center py-5">

                <i class="bi bi-calendar-x fs-1 text-muted"></i>

                <p class="mt-3 mb-0">

                    No upcoming deadlines.

                </p>

            </div>

        `;

        return;

    }

    deadlines.forEach((deadline, index) => {

        container.innerHTML += `

            <div class="d-flex justify-content-between align-items-center mb-4">

                <div>

                    <h6 class="mb-1">

                        ${deadline.project}

                    </h6>

                    <small class="text-muted">

                        ${deadline.stage}

                    </small>

                </div>

                <span class="badge bg-primary">

                    ${deadline.deadline}

                </span>

            </div>

            ${index < deadlines.length - 1 ? "<hr>" : ""}

        `;

    });

}

// ======================================================
// Employee Workload
// ======================================================

function populateWorkload(workloads) {

    const container = document.getElementById("employeeWorkload");

    if (!container) return;

    container.innerHTML = "";

    if (workloads.length === 0) {

        container.innerHTML = `

            <div class="text-center py-5">

                <i class="bi bi-people fs-1 text-muted"></i>

                <p class="mt-3 mb-0">

                    No employees found.

                </p>

            </div>

        `;

        return;

    }

    workloads.forEach(employee => {

        container.innerHTML += `

            <div class="mb-4">

                <div class="d-flex justify-content-between">

                    <span>

                        ${employee.employee}

                    </span>

                    <strong>

                        ${employee.workload}%

                    </strong>

                </div>

                <div class="progress mt-2">

                    <div
                        class="progress-bar ${getProgressColor(employee.workload)}"
                        style="width:${employee.workload}%">

                    </div>

                </div>

            </div>

        `;

    });

}

// ======================================================
// Client Status Badge
// ======================================================

function getClientStatus(status) {

    switch (status.toLowerCase()) {

        case "active":
            return "badge bg-success";

        case "inactive":
            return "badge bg-secondary";

        case "prospect":
            return "badge bg-warning text-dark";

        default:
            return "badge bg-primary";

    }

}