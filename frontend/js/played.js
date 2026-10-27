/* Played Games */

async function addPlayed(gameId, button) {

    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/played`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            body: JSON.stringify({ game_id: gameId, status: "Playing" })
        }
    );
    const data = await response.json();

    if (
        response.ok ||
        data.message === "Already in played games"
    ) {

        button.textContent =
            "✓ Added";

        button.disabled =
            true;

        button.style.backgroundColor = "green";

        button.style.color = "white";

    }
}

async function loadPlayedGames() {

    const token = localStorage.getItem("token");

    try {

        const response = await fetch(
            `${API_URL}/played`,
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        const playedGames = await response.json();

        const playedGamesWithDetails = await Promise.all(

            playedGames.map(async (playedGame) => {

                const gameResponse = await fetch(
                    `${API_URL}/games/${playedGame.game_id}`
                );

                const game = await gameResponse.json();

                return {
                    ...playedGame,
                    game
                };

            })

        );

        displayPlayedGames(
            playedGamesWithDetails
        );

    } catch (error) {

        console.error(error);

    }

}

function displayPlayedGames(playedGames) {

    const container =
        document.getElementById(
            "playedContainer"
        );

    if (!container) {
        return;
    }

    if (playedGames.length === 0) {

        container.innerHTML =
            createEmptyCard(
                "No Played Games Yet",
                "Played games will appear here."
            );

        return;

    }

    container.innerHTML = "";

    playedGames.forEach(playedGame => {

        const game =
            playedGame.game;

        const card =
            document.createElement("div");

        card.classList.add("card");

        card.innerHTML =

            createGameCard(game)

            +

            `

            <p>
                Status:
                ${playedGame.status}
            </p>

            <select
                onchange="updatePlayedGame(${playedGame.id}, this.value)"
            >

                <option
                    value="Playing"
                    ${playedGame.status === "Playing" ? "selected" : ""}
                >
                    Playing
                </option>

                <option
                    value="Completed"
                    ${playedGame.status === "Completed" ? "selected" : ""}
                >
                    Completed
                </option>

                <option
                    value="Dropped"
                    ${playedGame.status === "Dropped" ? "selected" : ""}
                >
                    Dropped
                </option>

                <option
                    value="Wishlist"
                    ${playedGame.status === "Wishlist" ? "selected" : ""}
                >
                    Wishlist
                </option>

            </select>

            <button
                type="button"
                onclick="deletePlayedGame(${playedGame.id}, this)"
            >
                Remove
            </button>

            `;

        container.appendChild(card);

    });

}

async function updatePlayedGame(id, status) {

    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/played/${id}`,
        {
            method: "PUT",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            body: JSON.stringify({ status })
        }
    );
    const data = await response.json();

    console.log(data.message);
}

async function deletePlayedGame(id, button) {

    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/played/${id}`,
        {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        }
    );

    if (response.ok) {

        button.textContent =
            "✓ Removed";

        button.disabled =
            true;

        button.style.backgroundColor = "gray";

        button.style.color = "white";
        /*
                setTimeout(() => {
        
                    loadPlayedGames();
        
                }, 1000);
        */
    }
}