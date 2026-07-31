const params = new URLSearchParams(window.location.search);

const clientId = params.get("id");
async function loadClient() {

    try {

        const client = await apiRequest(`/clients/${clientId}`);

        document.getElementById("clientName").textContent =
    client.company_name;

document.getElementById("clientIndustry").textContent =
    client.industry || "-";

document.getElementById("clientEmail").textContent =
    client.email || "-";

document.getElementById("clientPhone").textContent =
    client.phone || "-";

document.getElementById("clientWebsite").textContent =
    client.website || "-";

    document.getElementById("contactName").textContent =
    client.contact_person || "-";

document.getElementById("contactEmail").textContent =
    client.contact_email || "-";

document.getElementById("contactPhone").textContent =
    client.contact_phone || "-";

    document.getElementById("clientAvatar").src =
`https://ui-avatars.com/api/?name=${encodeURIComponent(client.company_name)}&background=4F46E5&color=fff&rounded=true&bold=true&size=128`;

const statusBadge = document.getElementById("clientStatus");

statusBadge.textContent = client.status;

statusBadge.className = "badge";

if (client.status === "Active") {
    statusBadge.classList.add("bg-success");
}
else if (client.status === "Inactive") {
    statusBadge.classList.add("bg-secondary");
}
else {
    statusBadge.classList.add("bg-warning", "text-dark");
}
const projects = await apiRequest(
    `/projects/client/${clientId}`
);

console.log(projects);

const table = document.getElementById("projectTable");

table.innerHTML = "";

if (projects.length === 0) {

    table.innerHTML = `
        <tr>

            <td colspan="4" class="text-center py-5">

                <i class="bi bi-folder2-open fs-1 text-muted"></i>

                <h5 class="mt-3">

                    No Projects Found

                </h5>

                <p class="text-muted">

                    This client doesn't have any projects yet.

                </p>

            </td>

        </tr>
    `;

    document.getElementById("projectCount").textContent = "0";

    return;

}

function getStatusBadge(status) {

    switch (status) {

        case "Completed":
            return "bg-success";

        case "In Progress":
            return "bg-primary";

        case "Planning":
            return "bg-warning text-dark";

        case "Delayed":
            return "bg-danger";

        case "On Hold":
            return "bg-secondary";

        default:
            return "bg-info";
    }

}

projects.forEach(project => {

    table.innerHTML += `
        <tr
style="cursor:pointer"
onclick="window.location='project-details.html?id=${project.id}'">

            <td>${project.name}</td>

            <td>
                <span class="badge ${getStatusBadge(project.status)}">
    ${project.status}
</span>
            </td>

            <td style="min-width:180px;">

<div class="d-flex justify-content-between mb-1">

<small>${project.progress}%</small>

</div>

<div class="progress" style="height:10px;">

<div
class="progress-bar ${
project.progress >= 100
? "bg-success"
: project.progress >= 60
? "bg-primary"
: project.progress >= 30
? "bg-warning"
: "bg-danger"
}"
style="width:${project.progress}%">

</div>

</div>

</td>

            <td>

                <a
href="project-details.html?id=${project.id}"
class="btn btn-outline-primary btn-sm">

<i class="bi bi-arrow-right-circle"></i>

</a>

            </td>

        </tr>
    `;

});

document.getElementById("projectCount").textContent =
    projects.length;

document.getElementById("completedProjects").textContent =
    projects.filter(
        project => project.status === "Completed"
    ).length;

document.getElementById("planningProjects").textContent =
    projects.filter(
        project => project.status === "Planning"
    ).length;

document.getElementById("progressProjects").textContent =
    projects.filter(
        project => project.status === "In Progress"
    ).length;

console.log(client);


    }

    catch (error) {

        console.error(error);

        alert("Unable to load client.");

    }

}

loadClient();

