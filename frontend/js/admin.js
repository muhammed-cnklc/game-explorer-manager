async function loadUsers() {

    const container = document.getElementById("usersContainer");

    if (!container) {
        return;
    }

    try {

        const token = localStorage.getItem("token");

        const response =
            await fetch(
                `${API_URL}/admin/users`,
                {
                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );

        const users = await response.json();

        displayUsers(users);

    } catch (error) {

        console.error(error);
    }
}

function displayUsers(users) {

    const container = document.getElementById("usersContainer");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    users.forEach(user => {

        const card = document.createElement("div");

        card.classList.add("card");
        card.innerHTML = `
            <h3>${user.username}</h3>
            <p>Email: ${user.email}</p>
            <p>Role: ${user.role}</p>
            <p>Created: ${user.created_at}</p>

            ${user.role !== "admin" ? `
                <button type="button" onclick="deleteUser(${user.id}, this)">
                    Delete User
                </button>
            ` : ""}
        `;

        container.appendChild(card);
    });
}

async function deleteUser(id, button) {

    const token = localStorage.getItem("token");

    try {

        const response =
            await fetch(
                `${API_URL}/admin/users/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );

        const data = await response.json();

        console.log(data.message);

        if (response.ok) {

            button.textContent = "✓ Deleted";
            button.disabled = true;
            button.style.backgroundColor = "gray";
            button.style.color = "white";
/*
            setTimeout(() => {

                loadUsers();

            }, 1000);
*/

        }

    } catch (error) {

        console.error(error);
    }
}

/* Statistics */

async function loadStatistics() {

    const container = document.getElementById("statisticsContainer");

    if (!container) {
        return;
    }

    try {

        const token = localStorage.getItem("token");

        const response =
            await fetch(
                `${API_URL}/admin/statistics`,
                {
                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );

        const statistics = await response.json();

        displayStatistics(statistics);

    } catch (error) {

        console.error(error);
    }
}

function displayStatistics(statistics) {

    const container = document.getElementById("statisticsContainer");

    if (!container) {
        return;
    }

    container.innerHTML = `

        <div class="card">
            <h3>Total Users</h3>
            <p>${statistics.totalUsers}</p>
        </div>
        <div class="card">
            <h3>Total Favorites</h3>
            <p>${statistics.totalFavorites}</p>
        </div>
        <div class="card">
            <h3>Total Played Games</h3>
            <p>${statistics.totalPlayedGames}</p>
        </div>
        <div class="card">
            <h3>Total Featured Games</h3>
            <p>${statistics.totalFeaturedGames}</p>
        </div>
    `;
}