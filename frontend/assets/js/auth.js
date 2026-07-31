/* ==========================================
   ScriptFlow PMS
   Authentication
========================================== */

const loginForm = document.getElementById("loginForm");

const errorMessage = document.getElementById("errorMessage");

const loginButton = document.getElementById("loginButton");

const loginButtonText =
    document.getElementById("loginButtonText");

const passwordInput =
    document.getElementById("password");

const togglePassword =
    document.getElementById("togglePassword");

const togglePasswordIcon =
    document.getElementById("togglePasswordIcon");

/* ==========================================
   Show / Hide Password
========================================== */

if (togglePassword) {

    togglePassword.addEventListener("click", () => {

        if (passwordInput.type === "password") {

            passwordInput.type = "text";

            togglePasswordIcon.classList.remove("bi-eye");

            togglePasswordIcon.classList.add("bi-eye-slash");

        }

        else {

            passwordInput.type = "password";

            togglePasswordIcon.classList.remove("bi-eye-slash");

            togglePasswordIcon.classList.add("bi-eye");

        }

    });

}

/* ==========================================
   Login
========================================== */

loginForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    errorMessage.textContent = "";

    loginButton.disabled = true;

    loginButton.innerHTML = `

        <span
            class="spinner-border spinner-border-sm me-2">
        </span>

        Signing In...

    `;

    const email =
        document.getElementById("email").value.trim();

    const password =
        passwordInput.value;

    try {

        const response = await fetch(

            "http://127.0.0.1:8000/auth/login",

            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    email,

                    password

                })

            }

        );

        const data = await response.json();

        if (!response.ok) {

            errorMessage.textContent =
                data.detail || "Login failed.";

            loginButton.disabled = false;

            loginButton.innerHTML = `
                <span id="loginButtonText">
                    Login
                </span>
            `;

            return;

        }

        localStorage.setItem(
            "access_token",
            data.access_token
        );

        loginButton.innerHTML = `

            <i class="bi bi-check-circle-fill me-2"></i>

            Success

        `;

        setTimeout(() => {

            window.location.href =
                "dashboard.html";

        }, 500);

    }

    catch (error) {

        console.error(error);

        errorMessage.textContent =
            "Unable to connect to the server.";

        loginButton.disabled = false;

        loginButton.innerHTML = `
            <span id="loginButtonText">
                Login
            </span>
        `;

    }

});