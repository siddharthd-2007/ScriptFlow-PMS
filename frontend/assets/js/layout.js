// ======================================================
// ScriptFlow PMS
// Shared Layout Controller
// ======================================================

document.addEventListener("DOMContentLoaded", () => {

    const currentPage = window.location.pathname.split("/").pop();

    if (typeof loadSidebar === "function") {
        loadSidebar(currentPage);
    }

    if (typeof loadTopbar === "function") {
        loadTopbar({
            page: document.title.split("|")[0].trim(),
            subtitle: ""
        });
    }

    initializeLayout();

});
// ======================================================
// Initialize
// ======================================================

function initializeLayout() {

    initializeGreeting();

    initializeDateTime();

    initializeSidebar();

    initializeButtons();

}

// ======================================================
// Greeting
// ======================================================

function initializeGreeting() {

    const greeting = document.getElementById("greeting");

    if (!greeting) return;

    const hour = new Date().getHours();

    let text = "Good Evening";

    if (hour < 12) {

        text = "Good Morning";

    }

    else if (hour < 18) {

        text = "Good Afternoon";

    }

    greeting.textContent = `${text}, Admin 👋`;

}

// ======================================================
// Date & Time
// ======================================================

function initializeDateTime() {

    const element = document.getElementById("currentDateTime");

    if (!element) return;

    updateClock(element);

    setInterval(() => {

        updateClock(element);

    }, 1000);

}

function updateClock(element) {

    const now = new Date();

    element.textContent = now.toLocaleString("en-IN", {

        weekday: "long",

        day: "numeric",

        month: "long",

        year: "numeric",

        hour: "numeric",

        minute: "2-digit"

    });

}
// ======================================================
// Sidebar
// ======================================================

function initializeSidebar() {

    highlightCurrentPage();

    initializeSidebarToggle();

}

// ======================================================
// Active Sidebar Item
// ======================================================

function highlightCurrentPage() {

    const currentPage = window.location.pathname
        .split("/")
        .pop()
        .toLowerCase();

    const menuLinks = document.querySelectorAll(".sidebar a");

    menuLinks.forEach(link => {

        link.classList.remove("active");

        const href = link.getAttribute("href");

        if (!href) return;

        if (href.toLowerCase() === currentPage) {

            link.classList.add("active");

        }

    });

}

// ======================================================
// Sidebar Toggle
// ======================================================

function initializeSidebarToggle() {

    const toggle = document.getElementById("sidebarToggle");

    const sidebar = document.querySelector(".sidebar");

    const wrapper = document.querySelector(".wrapper");

    if (!toggle || !sidebar || !wrapper) return;

    // Restore previous state

    if (localStorage.getItem("sidebar") === "collapsed") {

        sidebar.classList.add("collapsed");

        wrapper.classList.add("sidebar-collapsed");

    }

    toggle.addEventListener("click", () => {

        sidebar.classList.toggle("collapsed");

        wrapper.classList.toggle("sidebar-collapsed");

        if (sidebar.classList.contains("collapsed")) {

            localStorage.setItem("sidebar", "collapsed");

        }

        else {

            localStorage.setItem("sidebar", "expanded");

        }

    });

}

// ======================================================
// Navigate Helper
// ======================================================

function navigate(url) {

    window.location.href = url;

}
// ======================================================
// Global Buttons
// ======================================================

function initializeButtons() {

    initializeNotificationButton();

    initializeMessageButton();

    initializeProfileMenu();

    initializeLogout();

    initializeGlobalSearch();

}

// ======================================================
// Notifications
// ======================================================

function initializeNotificationButton() {

    const button = document.getElementById("notificationBtn");

    if (!button) return;

    button.addEventListener("click", () => {

        showToast("Notifications will be available soon.", "info");

    });

}

// ======================================================
// Messages
// ======================================================

function initializeMessageButton() {

    const button = document.getElementById("messageBtn");

    if (!button) return;

    button.addEventListener("click", () => {

        showToast("Messaging module is coming soon.", "info");

    });

}

// ======================================================
// Profile
// ======================================================

function initializeProfileMenu() {

    const profile = document.getElementById("profileButton");

    if (!profile) return;

    profile.addEventListener("click", () => {

        window.location.href = "settings.html";

    });

}

// ======================================================
// Logout
// ======================================================

function initializeLogout() {

    const logout = document.getElementById("logoutBtn");

    if (!logout) return;

    logout.addEventListener("click", () => {

        if (!confirm("Are you sure you want to logout?")) {

            return;

        }

        localStorage.removeItem("access_token");

        window.location.href = "login.html";

    });

}

// ======================================================
// Global Search
// ======================================================

function initializeGlobalSearch() {

    const search = document.getElementById("globalSearch");

    if (!search) return;

    search.addEventListener("keydown", function(event) {

        if (event.key !== "Enter") return;

        const value = this.value.trim();

        if (!value) return;

        console.log("Global Search:", value);

        showToast(`Searching for "${value}"`, "info");

    });

}

// ======================================================
// Toast
// ======================================================

function showToast(message, type = "info") {

    console.log(`[${type.toUpperCase()}] ${message}`);

}

// ======================================================
// Global Buttons
// ======================================================

function initializeButtons() {

    initializeNotificationButton();

    initializeMessageButton();

    initializeProfileMenu();

    initializeLogout();

    initializeGlobalSearch();

}

// ======================================================
// Notifications
// ======================================================

function initializeNotificationButton() {

    const button = document.getElementById("notificationBtn");

    if (!button) return;

    button.addEventListener("click", () => {

        showToast("Notifications will be available soon.", "info");

    });

}

// ======================================================
// Messages
// ======================================================

function initializeMessageButton() {

    const button = document.getElementById("messageBtn");

    if (!button) return;

    button.addEventListener("click", () => {

        showToast("Messaging module is coming soon.", "info");

    });

}

// ======================================================
// Profile
// ======================================================

function initializeProfileMenu() {

    const profile = document.getElementById("profileButton");

    if (!profile) return;

    profile.addEventListener("click", () => {

        window.location.href = "settings.html";

    });

}

// ======================================================
// Logout
// ======================================================

function initializeLogout() {

    const logout = document.getElementById("logoutBtn");

    if (!logout) return;

    logout.addEventListener("click", () => {

        if (!confirm("Are you sure you want to logout?")) {

            return;

        }

        localStorage.removeItem("access_token");

        window.location.href = "login.html";

    });

}

// ======================================================
// Global Search
// ======================================================

function initializeGlobalSearch() {

    const search = document.getElementById("globalSearch");

    if (!search) return;

    search.addEventListener("keydown", function(event) {

        if (event.key !== "Enter") return;

        const value = this.value.trim();

        if (!value) return;

        console.log("Global Search:", value);

        showToast(`Searching for "${value}"`, "info");

    });

}

// ======================================================
// Toast
// ======================================================

function showToast(message, type = "info") {

    console.log(`[${type.toUpperCase()}] ${message}`);

}