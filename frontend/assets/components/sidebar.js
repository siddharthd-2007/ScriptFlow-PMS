// ======================================================
// ScriptFlow PMS
// Sidebar Component
// ======================================================

function loadSidebar(activePage = "") {

    const sidebar = document.getElementById("sidebar");

    if (!sidebar) return;

    sidebar.innerHTML = `

<aside class="sidebar">

    <div>

        <div class="sidebar-logo">

            <i class="bi bi-code-slash"></i>

            <h2>ScriptFlow</h2>

        </div>

        <nav class="sidebar-menu">

            ${createMenuItem("dashboard.html","bi-grid-fill","Dashboard",activePage)}

            ${createMenuItem("clients.html","bi-buildings-fill","Clients",activePage)}

            ${createMenuItem("projects.html","bi-kanban-fill","Projects",activePage)}

            ${createMenuItem("modules.html","bi-boxes","Modules",activePage)}

            ${createMenuItem("tasks.html","bi-list-check","Tasks",activePage)}

            ${createMenuItem("employees.html","bi-people-fill","Employees",activePage)}

            ${createMenuItem("calendar.html","bi-calendar-event-fill","Calendar",activePage)}

            ${createMenuItem("reports.html","bi-bar-chart-fill","Reports",activePage)}

            ${createMenuItem("settings.html","bi-gear-fill","Settings",activePage)}

        </nav>

    </div>

    <div class="sidebar-footer">

    <div class="user-card">

        <img
            class="user-avatar"
            src="https://ui-avatars.com/api/?name=Admin+User&background=4F46E5&color=ffffff&rounded=true&size=80"
            alt="Admin">

        <div class="user-info">

            <h6>Admin User</h6>

            <p>Administrator</p>

        </div>

    </div>

    <button
        id="logoutBtn"
        class="logout-btn">

        <i class="bi bi-box-arrow-right me-2"></i>

        Logout

    </button>

</div>

</aside>

`;

}
// ======================================================
// Menu Item
// ======================================================

function createMenuItem(

    url,

    icon,

    text,

    activePage

){

    const active =

        activePage === url

        ? "active"

        : "";

    return `

<a
    href="${url}"
    class="${active}">

    <i class="bi ${icon}"></i>

    <span>

        ${text}

    </span>

</a>

`;

}