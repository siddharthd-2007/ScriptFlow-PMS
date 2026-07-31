let editingEmployeeId = null;
let allEmployees = [];

async function loadEmployees() {

    try {

        allEmployees = await apiRequest("/employees/");

        document.getElementById("totalEmployees").textContent =
    allEmployees.length;

document.getElementById("activeEmployees").textContent =
    allEmployees.filter(emp => emp.is_active).length;

document.getElementById("departmentCount").textContent =
    new Set(
        allEmployees
            .map(emp => emp.department)
            .filter(Boolean)
    ).size;

document.getElementById("managerCount").textContent =
    allEmployees.filter(
        emp =>
            emp.role === "Manager" ||
            emp.role === "Project Manager"
    ).length;

        const table = document.getElementById("employeeTable");

        table.innerHTML = "";

        allEmployees.forEach(employee => {

            table.innerHTML += `
                <tr>

                    <td>
                        <img
                            src="https://ui-avatars.com/api/?name=${employee.full_name}&background=4F46E5&color=fff&rounded=true&bold=true"
                            class="rounded-circle"
                            width="45">
                    </td>

                    <td>${employee.full_name}</td>

                    <td>${employee.email}</td>

                    <td>

<span class="badge ${
    employee.role === "Admin"
        ? "bg-danger"
        : employee.role === "Project Manager"
        ? "bg-warning text-dark"
        : "bg-primary"
}">

${employee.role}

</span>

</td>

                    <td>

<span class="badge bg-light text-dark border">

${employee.department ?? "-"}

</span>

</td>

                    <td>
                        <span class="badge rounded-pill ${
    employee.is_active
        ? "bg-success"
        : "bg-secondary"
}">
                            ${
                                employee.is_active
                                    ? "Active"
                                    : "Inactive"
                            }
                        </span>
                    </td>

                    <td>

<div class="d-flex gap-2">

<button
class="btn btn-outline-info btn-sm"
onclick="viewEmployee(${employee.id})"
title="View">

<i class="bi bi-eye"></i>

</button>

<button
class="btn btn-outline-primary btn-sm"
onclick="editEmployee(${employee.id})"
title="Edit">

<i class="bi bi-pencil"></i>

</button>

<button
class="btn btn-outline-danger btn-sm"
onclick="deactivateEmployee(${employee.id})"
title="Deactivate">

<i class="bi bi-trash"></i>

</button>

</div>

</td>

                </tr>
            `;

        });

    }

    catch (error) {

        console.error(error);

        alert("Unable to load employees.");

    }

}

loadEmployees();

const employeeForm = document.getElementById("employeeForm");

employeeForm.addEventListener("submit", async function (e) {

    e.preventDefault();

    const employee = {

        full_name: document.getElementById("full_name").value,

        email: document.getElementById("email").value,

        password: document.getElementById("password").value,

        role: document.getElementById("role").value,

        department: document.getElementById("department").value,

        employee_code: document.getElementById("employee_code").value,

        phone: document.getElementById("phone").value,

        designation: document.getElementById("designation").value,

        joining_date: document.getElementById("joining_date").value

    };

    try {

        if (editingEmployeeId === null) {

    // Create Employee

    await apiRequest(
        "/employees/",
        "POST",
        employee
    );

    alert("Employee Added Successfully!");

} else {

    // Update Employee

    await apiRequest(
        `/employees/${editingEmployeeId}`,
        "PUT",
        employee
    );

    alert("Employee Updated Successfully!");

    editingEmployeeId = null;
}

// Reload employee list
await loadEmployees();

// Clear form
employeeForm.reset();

// Close modal
const modalElement = document.getElementById("addEmployeeModal");

const modal = bootstrap.Modal.getInstance(modalElement);

modal.hide();

    }

    catch (error) {

        alert("Unable to add employee.");

        console.error(error);

    }

});

async function editEmployee(employeeId) {
    editingEmployeeId = employeeId;

    try {

        const employee = await apiRequest(
            `/employees/${employeeId}`
        );

        document.getElementById("full_name").value = employee.full_name;

        document.getElementById("email").value = employee.email;

        document.getElementById("role").value = employee.role;

        document.getElementById("department").value =
            employee.department || "";

        document.getElementById("employee_code").value =
            employee.employee_code || "";

        document.getElementById("phone").value =
            employee.phone || "";

        document.getElementById("designation").value =
            employee.designation || "";

        document.getElementById("joining_date").value =
            employee.joining_date || "";

        document.getElementById("password").value = "";

        const modal = new bootstrap.Modal(
            document.getElementById("addEmployeeModal")
        );

        modal.show();

    }

    catch (error) {

        console.error(error);

        alert("Unable to load employee.");

    }

}

async function deactivateEmployee(employeeId) {

    const confirmDeactivate = confirm(
        "Are you sure you want to deactivate this employee?"
    );

    if (!confirmDeactivate) {
        return;
    }

    try {

        await apiRequest(
            `/employees/${employeeId}`,
            "DELETE"
        );

        alert("Employee deactivated successfully!");

        await loadEmployees();

    }

    catch (error) {

        console.error(error);

        alert("Unable to deactivate employee.");

    }

}

const searchInput = document.getElementById("searchEmployee");

searchInput.addEventListener("keyup", function () {

    const keyword = this.value.toLowerCase();

    const table = document.getElementById("employeeTable");

    table.innerHTML = "";

    const filteredEmployees = allEmployees.filter(employee => {

        return (
            employee.full_name.toLowerCase().includes(keyword) ||
            employee.email.toLowerCase().includes(keyword) ||
            employee.department?.toLowerCase().includes(keyword) ||
            employee.role.toLowerCase().includes(keyword)
        );

    });

    filteredEmployees.forEach(employee => {

        table.innerHTML += `
            <tr>

                <td>
                    <img
                        src="https://ui-avatars.com/api/?name=${employee.full_name}&background=4F46E5&color=fff&rounded=true&bold=true"
                        class="rounded-circle"
                        width="45">
                </td>

                <td>${employee.full_name}</td>

                <td>${employee.email}</td>

                <td>

<span class="badge ${
    employee.role === "Admin"
        ? "bg-danger"
        : employee.role === "Project Manager"
        ? "bg-warning text-dark"
        : "bg-primary"
}">

${employee.role}

</span>

</td>

                <td>

<span class="badge bg-light text-dark border">

${employee.department ?? "-"}

</span>

</td>

                <td>

<span class="badge rounded-pill ${
    employee.is_active
        ? "bg-success"
        : "bg-secondary"
}">

${employee.is_active ? "Active" : "Inactive"}

</span>

</td>

                    <button
                        class="btn btn-warning btn-sm me-2"
                        onclick="editEmployee(${employee.id})">

                        <i class="bi bi-pencil-square"></i>
                        Edit

                    </button>

                    <button
                        class="btn btn-danger btn-sm"
                        onclick="deactivateEmployee(${employee.id})">

                        <i class="bi bi-person-x-fill"></i>
                        Deactivate

                    </button>

                </td>

            </tr>
        `;

    });

});

const departmentFilter = document.getElementById("departmentFilter");

departmentFilter.addEventListener("change", function () {

    const department = this.value;

    const table = document.getElementById("employeeTable");

    table.innerHTML = "";

    let filteredEmployees = allEmployees;

    if (department !== "All Departments") {

        filteredEmployees = allEmployees.filter(employee =>
            employee.department === department
        );

    }

    filteredEmployees.forEach(employee => {

        table.innerHTML += `
            <tr>

                <td>
                    <img
                        src="https://ui-avatars.com/api/?name=${employee.full_name}&background=4F46E5&color=fff&rounded=true&bold=true"
                        class="rounded-circle"
                        width="45">
                </td>

                <td>${employee.full_name}</td>

                <td>${employee.email}</td>

                <td>

<span class="badge ${
    employee.role === "Admin"
        ? "bg-danger"
        : employee.role === "Project Manager"
        ? "bg-warning text-dark"
        : "bg-primary"
}">

${employee.role}

</span>

</td>

                <td>

<span class="badge bg-light text-dark border">

${employee.department ?? "-"}

</span>

</td>

                <td>

<span class="badge rounded-pill ${
    employee.is_active
        ? "bg-success"
        : "bg-secondary"
}">

${employee.is_active ? "Active" : "Inactive"}

</span>

</td>

<td>

<div class="d-flex gap-2">

<button
class="btn btn-outline-primary btn-sm"
onclick="editEmployee(${employee.id})">

<i class="bi bi-pencil"></i>

</button>

<button
class="btn btn-outline-danger btn-sm"
onclick="deactivateEmployee(${employee.id})">

<i class="bi bi-trash"></i>

</button>

</div>

</td>

            </tr>
        `;

    });

});
function viewEmployee(employeeId) {

    window.location.href =
        `employee-details.html?id=${employeeId}`;

}

const addEmployeeBtn = document.getElementById("addEmployeeBtn");

if (addEmployeeBtn) {

    addEmployeeBtn.addEventListener("click", () => {

        editingEmployeeId = null;

        employeeForm.reset();

        const modal = new bootstrap.Modal(
            document.getElementById("addEmployeeModal")
        );

        modal.show();

    });

}