// ======================================================
// ScriptFlow PMS
// Toast Component
// ======================================================

function showToast(message, type = "success") {

    let container = document.getElementById("toastContainer");

    if (!container) {

        container = document.createElement("div");

        container.id = "toastContainer";

        container.className =
            "toast-container position-fixed top-0 end-0 p-3";

        document.body.appendChild(container);

    }

    const colors = {

        success: "text-bg-success",

        danger: "text-bg-danger",

        warning: "text-bg-warning",

        info: "text-bg-primary"

    };

    const toast = document.createElement("div");

    toast.className = `toast align-items-center border-0 ${colors[type] || colors.info}`;

    toast.role = "alert";

    toast.innerHTML = `

        <div class="d-flex">

            <div class="toast-body">

                ${message}

            </div>

            <button

                class="btn-close btn-close-white me-2 m-auto"

                data-bs-dismiss="toast">

            </button>

        </div>

    `;

    container.appendChild(toast);

    const bsToast = new bootstrap.Toast(toast, {

        delay: 3000

    });

    bsToast.show();

    toast.addEventListener("hidden.bs.toast", () => {

        toast.remove();

    });

}

