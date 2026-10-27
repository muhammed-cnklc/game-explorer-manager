/* Featured Games */

async function loadFeaturedGames() {

    try {

        const response =
            await fetch(
                `${API_URL}/admin/featured`
            );

        const featuredGames =
            await response.json();

        const featuredGamesWithDetails =
            await Promise.all(

                featuredGames.map(
                    async (featuredGame) => {

                        const gameResponse =
                            await fetch(
                                `${API_URL}/games/${featuredGame.game_id}`
                            );

                        const game =
                            await gameResponse.json();

                        return {
                            ...featuredGame,
                            game
                        };

                    }
                )

            );

        displayFeaturedGames(
            featuredGamesWithDetails
        );

    } catch (error) {

        console.error(error);

    }

}

async function loadFeaturedPreview() {

    const container =
        document.getElementById(
            "featuredPreviewContainer"
        );

    if (!container) {
        return;
    }

    try {

        const response =
            await fetch(
                `${API_URL}/admin/featured`
            );

        const featuredGames =
            await response.json();

        const featuredGamesWithDetails =
            await Promise.all(

                featuredGames.map(
                    async (featuredGame) => {

                        const gameResponse =
                            await fetch(
                                `${API_URL}/games/${featuredGame.game_id}`
                            );

                        const game =
                            await gameResponse.json();

                        return {
                            ...featuredGame,
                            game
                        };

                    }
                )

            );

        const preview =
            featuredGamesWithDetails.slice(0, 3);

        displayFeaturedPreview(
            preview
        );

    } catch (error) {

        console.error(error);

    }

}

function displayFeaturedPreview(featuredGames) {

    const container =
        document.getElementById(
            "featuredPreviewContainer"
        );

    if (!container) {
        return;
    }

    container.innerHTML = "";

    featuredGames.forEach(featuredGame => {

        const game =
            featuredGame.game;

        const card =
            document.createElement("div");

        card.classList.add("card");

        card.innerHTML = `

            <h3>${game.name}</h3>

            ${game.cover
                ? `<img src="${game.cover}" alt="${game.name}">`
                : ""
            }

        `;

        container.appendChild(card);

    });

}

function displayFeaturedGames(featuredGames) {

    const container =
        document.getElementById(
            "featuredContainer"
        );

    if (!container) {
        return;
    }

    const isAdmin =
        localStorage.getItem("role") === "admin";

    if (featuredGames.length === 0) {

        container.innerHTML =
            createEmptyCard(
                "No Featured Games Available",
                "Featured games selected by administrators will appear here."
            );

        return;

    }

    container.innerHTML = "";

    featuredGames.forEach(featuredGame => {

        const game =
            featuredGame.game;

        const card =
            document.createElement("div");

        card.classList.add("card");

        card.innerHTML =

            createGameCard(game)

            +

            `

            ${isAdmin ? `

                <button
                    type="button"
                    onclick="deleteFeaturedGame(${featuredGame.id}, this)"
                >
                    Remove
                </button>

            ` : ""}

            `;

        container.appendChild(card);

    });

}

async function addFeaturedGame(event) {

    event.preventDefault();

    const token = localStorage.getItem("token");
    const game_id = document.getElementById("featuredGameId").value;
    const response = await fetch(`${API_URL}/admin/featured`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            body: JSON.stringify({ game_id })
        }
    );
    const data = await response.json();


    loadFeaturedGames();

}

function updateFeaturedPage() {

    const adminSection =
        document.getElementById(
            "featuredAdminSection"
        );

    if (!adminSection) {
        return;
    }

    const isAdmin =
        localStorage.getItem("role") === "admin";

    adminSection.style.display =
        isAdmin
            ? "block"
            : "none";

}

async function deleteFeaturedGame(id, button) {

    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/admin/featured/${id}`,
        {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        }
    );
    const data = await response.json();

    if (response.ok) {

        button.textContent =
            "✓ Removed";

        button.disabled =
            true;


        button.style.backgroundColor = "gray";

        button.style.color = "white";
/*
        setTimeout(() => {

            loadFeaturedGames();

        }, 1000);
*/
    }
}