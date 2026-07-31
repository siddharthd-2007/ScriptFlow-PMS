document.addEventListener("DOMContentLoaded", () => {

    // ==============================
    // Load Shared Components
    // ==============================

    if (typeof loadSidebar === "function") {
        loadSidebar("settings.html");
    }

    if (typeof loadTopbar === "function") {
        loadTopbar({
            page: "Settings",
            subtitle: "Manage your application settings",
            showSearch: false,
            showNewButton: false
        });
    }

    // Load settings from backend
    loadSettings();

    // ==============================
    // Elements
    // ==============================

    const tabs = document.querySelectorAll(".settings-tab");
    const sections = document.querySelectorAll(".settings-section");
    const title = document.getElementById("settingsTitle");
    const saveBtn = document.getElementById("saveSettings");

    // ==============================
    // Switch Tabs
    // ==============================

    tabs.forEach(tab => {

        tab.addEventListener("click", () => {

            tabs.forEach(btn => btn.classList.remove("active"));
            tab.classList.add("active");

            sections.forEach(section => {
                section.classList.add("d-none");
            });

            const target = document.getElementById(tab.dataset.section);

            if (target) {
                target.classList.remove("d-none");
            }

            title.textContent = tab.textContent.trim() + " Settings";

        });

    });

    // ==============================
    // Save Settings
    // ==============================

    if (saveBtn) {

        saveBtn.addEventListener("click", async () => {

            try {

                await apiRequest("/settings", "PUT", {

                    language: document.getElementById("language").value,
                    timezone: document.getElementById("timezone").value,
                    date_format: document.getElementById("dateFormat").value,
                    theme: document.getElementById("theme").value,

                    company_name: document.getElementById("companyName").value,
                    company_email: document.getElementById("companyEmail").value,
                    company_phone: document.getElementById("companyPhone").value,
                    company_website: document.getElementById("companyWebsite").value,
                    company_address: document.getElementById("companyAddress").value

                });

                const originalHTML = saveBtn.innerHTML;

                saveBtn.disabled = true;

                saveBtn.innerHTML =
                    '<i class="bi bi-check-circle me-2"></i>Saved';

                setTimeout(() => {

                    saveBtn.innerHTML = originalHTML;
                    saveBtn.disabled = false;

                }, 1500);

            } catch (error) {

                console.error("Failed to save settings:", error);

                alert("Failed to save settings.");

            }

        });

    }

});

// ==============================
// Load Settings
// ==============================

async function loadSettings() {

    try {

        const settings = await apiRequest("/settings");

        document.getElementById("language").value = settings.language;
        document.getElementById("timezone").value = settings.timezone;
        document.getElementById("dateFormat").value = settings.date_format;
        document.getElementById("theme").value = settings.theme;

        document.getElementById("companyName").value =
            settings.company_name || "";

        document.getElementById("companyEmail").value =
            settings.company_email || "";

        document.getElementById("companyPhone").value =
            settings.company_phone || "";

        document.getElementById("companyWebsite").value =
            settings.company_website || "";

        document.getElementById("companyAddress").value =
            settings.company_address || "";

    } catch (error) {

        console.error("Failed to load settings:", error);

    }

}