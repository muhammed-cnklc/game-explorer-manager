/* Authentication */

async function registerUser(event) {

    event.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch(`${API_URL}/auth/register`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password })
            }
        );
        const data = await response.json();

        document.getElementById("message").innerText = data.message;

        if (response.ok) {

            const button =
                event.target.querySelector(
                    "button"
                );

            button.textContent = "✓ Registration Successful";

            button.disabled = true;

            button.style.backgroundColor = "green";

            button.style.color = "white";

            setTimeout(() => {
                window.location.href = "./login.html";
            }, 3000);
        }

    } catch (error) {
        document.getElementById("message").innerText = error.message;
    }
}

async function loginUser(event) {

    event.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
        const response = await fetch(`${API_URL}/auth/login`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            }
        );
        const data = await response.json();

        if (data.token) {
            localStorage.setItem(
                "token", 
                data.token
            );

            localStorage.setItem(
                "username",
                data.user.username
            );

            localStorage.setItem(
                "role",
                data.user.role
            );

            window.location.href = "./index.html";

        } else {
            document.getElementById("loginMessage").innerText = data.message;
        }

    } catch (error) {
        document.getElementById("loginMessage").innerText = error.message;
    }
}

function requireLogin() {

    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "./login.html";
    }
}

function requireAdmin() {

    const token = localStorage.getItem("token");

    const role = localStorage.getItem("role");

    if (!token) {
        window.location.href = "./login.html";

        return;
    }

    if (role !== "admin") {
         window.location.href = "./index.html";
    }
}

function logoutUser() {

    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");

    window.location.href = "./login.html";
}