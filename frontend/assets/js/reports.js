// ======================================================
// ScriptFlow PMS
// Reports
// ======================================================

document.addEventListener("DOMContentLoaded", () => {

    initializeReports();

});

// ======================================================
// Initialize
// ======================================================

function initializeReports() {

    loadReportSummary();

    loadDepartmentPerformance();

    loadTopPerformers();

}

// ======================================================
// Report Summary
// ======================================================

async function loadReportSummary() {

    try {

        const data = await apiRequest("/reports/dashboard");

        document.getElementById("totalProjects").textContent =
            data.projects ?? 0;

        document.getElementById("totalEmployees").textContent =
            data.employees ?? 0;

        document.getElementById("totalTasks").textContent =
            data.tasks ?? 0;

    } catch (error) {

        console.error("Failed to load report summary:", error);

    }

}

// ======================================================
// Department Performance
// ======================================================

async function loadDepartmentPerformance() {

    try {

        const data = await apiRequest("/reports/task-status");

        const container = document.getElementById("taskStatusContainer");

        container.innerHTML = "";

        Object.entries(data).forEach(([status, count]) => {

            const total = Object.values(data)
                .reduce((sum, value) => sum + value, 0);

            const percentage = total
                ? Math.round((count / total) * 100)
                : 0;

            container.innerHTML += `
                <div class="mb-4">

                    <div class="d-flex justify-content-between mb-2">
                        <span>${status}</span>
                        <strong>${count}</strong>
                    </div>

                    <div class="progress">

                        <div
                            class="progress-bar"
                            style="width:${percentage}%"
                        >
                            ${percentage}%
                        </div>

                    </div>

                </div>
            `;

        });

    } catch (error) {

        console.error("Failed to load task status:", error);

    }

}

// ======================================================
// Top Performers
// ======================================================

async function loadTopPerformers() {

    try {

        const performers = await apiRequest("/reports/top-performers");

        const container = document.querySelector(
            ".col-lg-4 .dashboard-card-body"
        );

        container.innerHTML = "";

        if (performers.length === 0) {

            container.innerHTML = `
                <div class="text-center text-muted py-4">
                    No completed tasks yet
                </div>
            `;

            return;
        }

        performers.forEach((employee, index) => {

            const medal =
                index === 0 ? "🥇" :
                index === 1 ? "🥈" :
                index === 2 ? "🥉" : "⭐";

            container.innerHTML += `
                <div class="d-flex justify-content-between align-items-center mb-3">

                    <div>
                        ${medal} <strong>${employee.name}</strong>
                    </div>

                    <span class="badge bg-success">
                        ${employee.completed_tasks} Completed
                    </span>

                </div>
            `;

        });

    } catch (error) {

        console.error("Failed to load top performers:", error);

    }

}