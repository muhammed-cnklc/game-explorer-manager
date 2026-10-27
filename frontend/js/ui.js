/* NavBar */
function updateNavbar() {

    const role = localStorage.getItem("role");

    const token = localStorage.getItem("token");

    const navFavorites = document.getElementById("navFavorites");

    const navPlayed = document.getElementById("navPlayed");

    const navAdmin = document.getElementById("navAdmin");

    const navLogin = document.getElementById("navLogin");

    const navRegister = document.getElementById("navRegister");

    const navLogout = document.getElementById("navLogout");

    if (!token) {

        if (navFavorites)
            navFavorites.style.display = "none";

        if (navPlayed)
            navPlayed.style.display = "none";

        if (navAdmin)
            navAdmin.style.display = "none";

        if (navLogout)
            navLogout.style.display = "none";

        return;
    }

    if (navLogin)
        navLogin.style.display = "none";

    if (navRegister)
        navRegister.style.display = "none";

    if (role !== "admin") {

        if (navAdmin)
            navAdmin.style.display = "none";
    }
}

function updateUserInfo() {

    const userInfo = document.getElementById("userInfo");

    if (!userInfo) {
        return;
    }

    const username = localStorage.getItem("username");

    const role = localStorage.getItem("role");

    if (!username || !role) {

        userInfo.innerHTML = "";

        return;
    }

    userInfo.innerHTML =
        `${username} (${role})`;
}