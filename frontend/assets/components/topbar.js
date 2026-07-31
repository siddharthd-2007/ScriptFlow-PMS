// ======================================================
// ScriptFlow PMS
// Topbar Component
// ======================================================

function getGreeting() {

    const hour = new Date().getHours();

    if (hour < 12) {
        return "Good Morning";
    }

    if (hour < 17) {
        return "Good Afternoon";
    }

    return "Good Evening";
}

function loadTopbar(config = {}) {

    const {
        page = "Dashboard",
        subtitle = "",
        showSearch = true,
        searchPlaceholder = "Search...",
        showNewButton = true,
        newButtonText = "New",
        newButtonId = "newButton"
    } = config;

    const container = document.getElementById("topbar");

    if (!container) return;

    container.innerHTML = `
<header class="topbar">

    <div class="topbar-left">

        <span class="page-label">
            ${page}
        </span>

        <h2>
    ${page === "Dashboard"
        ? `${getGreeting()}, Admin 👋`
        : page}
</h2>

        <p>
            ${subtitle}
        </p>

    </div>

    <div class="topbar-right">

        ${showSearch ? `
<div class="search-box">
    <i class="bi bi-search"></i>
    <input
        id="globalSearch"
        type="text"
        placeholder="${searchPlaceholder}">
</div>
` : `<div class="flex-grow-1"></div>`}

        <button class="icon-btn">
            <i class="bi bi-bell-fill"></i>
        </button>

        <button class="icon-btn">
            <i class="bi bi-chat-dots-fill"></i>
        </button>

        ${showNewButton ? `
        <button
            id="${newButtonId}"
            class="btn btn-primary">

            <i class="bi bi-plus-lg"></i>
            ${newButtonText}

        </button>
        ` : ""}

        <img
            class="top-avatar"
            src="https://ui-avatars.com/api/?name=Admin&background=4F46E5&color=fff">

    </div>

</header>
`;
}

function initializeTopbar(config = {}) {

    loadTopbar(config);

    if (typeof initializeLayout === "function") {
        initializeLayout();
    }

}