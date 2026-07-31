document.addEventListener("DOMContentLoaded", async () => {
    await loadSidebar("clients");

    await initializeTopbar({
        page: "Clients",
        subtitle: "Manage all company clients",
        showSearch: true,
        searchPlaceholder: "Search clients...",
        newButtonText: "New Client",
        newButtonId: "addClientBtn",
    });

    await loadClients();

    const topbarBtn = document.getElementById("addClientBtn");

    if (topbarBtn) {
        topbarBtn.addEventListener("click", () => {
            editingClientId = null;

            clientForm.reset();

            const modal = new bootstrap.Modal(
                document.getElementById("addClientModal"),
            );

            modal.show();
        });
    }
});

let editingClientId = null;
let allClients = [];

async function loadClients() {
    try {
        allClients = await apiRequest("/clients/");

        document.getElementById("totalClients").textContent = allClients.length;

        document.getElementById("activeClients").textContent = allClients.filter(
            (client) => client.status === "Active",
        ).length;

        document.getElementById("prospectClients").textContent = allClients.filter(
            (client) => client.status === "Prospect",
        ).length;

        document.getElementById("industryCount").textContent = new Set(
            allClients.map((client) => client.industry).filter(Boolean),
        ).size;

        const table = document.getElementById("clientTable");

        table.innerHTML = "";

        if (allClients.length === 0) {
            table.innerHTML = `
<tr>

<td colspan="7" class="text-center py-5">

<i class="bi bi-buildings fs-1 text-muted"></i>

<h5 class="mt-3">

No Clients Found

</h5>

<p class="text-muted">

Click "Add New Client" to create your first client.

</p>

</td>

</tr>
`;

            return;
        }

        renderClients(allClients);

    } catch (error) {
        console.error(error);

        alert("Unable to load clients.");
    }
}

function renderClients(clients) {

    const table = document.getElementById("clientTable");

    table.innerHTML = "";

    clients.forEach(client => {

    table.innerHTML += `
        <tr>

            <td>
                <div class="d-flex align-items-center gap-3">

                    <img
                        src="https://ui-avatars.com/api/?name=${client.company_name}&background=4F46E5&color=fff&rounded=true&bold=true"
                        class="rounded-circle flex-shrink-0"
                        width="45"
                        height="45">

                    <div>

                        <a
                            href="client-details.html?id=${client.id}"
                            class="fw-semibold text-decoration-none text-dark">

                            ${client.company_name}

                        </a>

                        <small class="text-muted d-block">
                            CL${String(client.id).padStart(4, "0")}
                        </small>

                    </div>

                </div>
            </td>

            <td>

                <div class="fw-semibold">
                    ${client.contact_person || "-"}
                </div>

                <small class="text-muted">
                    ${client.contact_email || client.email || "Primary Contact"}
                </small>

            </td>

            <td>

                <a
                    href="mailto:${client.email}"
                    class="text-decoration-none text-dark">

                    <i class="bi bi-envelope-fill text-primary me-2"></i>

                    ${client.email || "-"}

                </a>

            </td>

            <td>

                <a
                    href="tel:${client.phone}"
                    class="text-decoration-none text-dark">

                    <i class="bi bi-telephone-fill text-success me-2"></i>

                    ${client.phone || "-"}

                </a>

            </td>

            <td>

                <span class="badge bg-light text-dark border">
                    ${client.industry || "-"}
                </span>

            </td>

            <td>

                <span class="badge rounded-pill ${
                    client.status === "Active"
                        ? "bg-success"
                        : client.status === "Prospect"
                        ? "bg-warning text-dark"
                        : "bg-secondary"
                }">

                    ${client.status}

                </span>

            </td>

            <td>

                <div class="d-flex gap-2">

                    <button
                        class="btn btn-outline-primary btn-sm"
                        title="Edit Client"
                        onclick="editClient(${client.id})">

                        <i class="bi bi-pencil"></i>

                    </button>

                    <button
                        class="btn btn-outline-danger btn-sm"
                        title="Deactivate Client"
                        onclick="deactivateClient(${client.id})">

                        <i class="bi bi-trash"></i>

                    </button>

                </div>

            </td>

        </tr>
    `;

});

}

const clientForm = document.getElementById("clientForm");

clientForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const client = {
        company_name: document.getElementById("company_name").value,

        email: document.getElementById("email").value,

        phone: document.getElementById("phone").value,

        website: document.getElementById("website").value,

        industry: document.getElementById("industry").value,

        contact_person: document.getElementById("contact_person").value,

        contact_email: document.getElementById("contact_email").value,

        contact_phone: document.getElementById("contact_phone").value,

        status: document.getElementById("status").value,
    };

    try {
        if (editingClientId === null) {
            // Create Client

            await apiRequest("/clients/", "POST", client);

            alert("Client Added Successfully!");
        } else {
            // Update Client

            await apiRequest(`/clients/${editingClientId}`, "PUT", client);

            alert("Client Updated Successfully!");

            editingClientId = null;
        }

        // Reload client list
        await loadClients();

        // Clear form
        clientForm.reset();

        // Close modal
        const modalElement = document.getElementById("addClientModal");

        const modal = bootstrap.Modal.getInstance(modalElement);

        modal.hide();
    } catch (error) {
        alert("Unable to add client.");

        console.error(error);
    }
});

async function editClient(clientId) {
    editingClientId = clientId;

    try {
        const client = await apiRequest(`/clients/${clientId}`);

        document.getElementById("company_name").value = client.company_name || "";
        document.getElementById("email").value = client.email || "";
        document.getElementById("phone").value = client.phone || "";
        document.getElementById("website").value = client.website || "";
        document.getElementById("industry").value = client.industry || "";
        document.getElementById("contact_person").value =
            client.contact_person || "";
        document.getElementById("contact_email").value = client.contact_email || "";
        document.getElementById("contact_phone").value = client.contact_phone || "";
        document.getElementById("status").value = client.status || "Prospect";

        const modal = new bootstrap.Modal(
            document.getElementById("addClientModal"),
        );

        modal.show();
    } catch (error) {
        console.error(error);

        alert("Unable to load client.");
    }
}

async function deactivateClient(clientId) {
    const confirmDeactivate = confirm(
        "Are you sure you want to deactivate this client?",
    );

    if (!confirmDeactivate) {
        return;
    }

    try {
        await apiRequest(`/clients/${clientId}`, "DELETE");

        alert("Client deactivated successfully!");

        await loadClients();
    } catch (error) {
        console.error(error);

        alert("Unable to deactivate client.");
    }
}

const searchInput = document.getElementById("searchClient");

searchInput.addEventListener("keyup", function () {
    const keyword = this.value.toLowerCase();

    const table = document.getElementById("clientTable");

    table.innerHTML = "";

    const filteredClients = allClients.filter((client) => {
        return (
            client.company_name.toLowerCase().includes(keyword) ||
            client.email.toLowerCase().includes(keyword) ||
            client.industry?.toLowerCase().includes(keyword) ||
            client.status.toLowerCase().includes(keyword)
        );
    });

    renderClients(filteredClients);
});

const departmentFilter = document.getElementById("departmentFilter");

departmentFilter.addEventListener("change", function () {
    const industry = this.value;
    console.log("Selected:", industry);
    console.log(allClients.map(c => c.industry));

    const table = document.getElementById("clientTable");

    table.innerHTML = "";

    let filteredClients = allClients;

    if (industry !== "All Departments") {
        filteredClients = allClients.filter(
            (client) => client.industry === industry,
        );
    }

    renderClients(filteredClients);
});
