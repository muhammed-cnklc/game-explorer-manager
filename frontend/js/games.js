async function loadFavoriteIds() {

    const token =
        localStorage.getItem("token");

    if (!token) {
        favoriteGameIds = [];
        return;
    }

    try {

        const response =
            await fetch(
                `${API_URL}/favorites`,
                {
                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );

        const favorites =
            await response.json();

        favoriteGameIds =
            favorites.map(
                favorite =>
                    Number(
                        favorite.game_id
                    )
            );

    } catch (error) {

        console.error(error);

    }

}

async function loadPlayedIds() {

    const token =
        localStorage.getItem("token");

    if (!token) {
        playedGameIds = [];
        return;
    }

    try {

        const response =
            await fetch(
                `${API_URL}/played`,
                {
                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );

        const playedGames =
            await response.json();

        playedGameIds =
            playedGames.map(
                played =>
                    Number(
                        played.game_id
                    )
            );

    } catch (error) {

        console.error(error);

    }

}

/* Games */

async function searchGames(event) {

    event.preventDefault();

    const searchTerm =
        document.getElementById(
            "searchInput"
        ).value;

    try {

        const response =
            await fetch(
                `${API_URL}/games/search?q=${searchTerm}`
            );

        const games =
            await response.json();

        await loadFavoriteIds();

        await loadPlayedIds();

        displayGames(games);

    } catch (error) {

        console.error(error);

    }

}

function createGameCard(game) {

    const releaseDate =
        game.released
            ? new Date(
                game.released * 1000
            ).toLocaleDateString(
                "de-AT",
                {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric"
                }
            )
            : "Unknown";

    const rating =
        game.rating
            ? game.rating.toFixed(1)
            : "N/A";


    const totalRatings =
    game.totalRatings ?? 0;

const hasCover =
    game.hasCover
        ? "Yes"
        : "No";

    const updated =
        game.updated && game.updated > 0
            ? new Date(
                game.updated * 1000
            ).toLocaleDateString(
                "de-AT",
                {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric"
                }
            )
            : "Unknown";

    return `

        <h3>${game.name}</h3>

        ${game.cover
            ? `<img src="${game.cover}" alt="${game.name}">`
            : ""
        }

        <p>ID: ${game.id}</p>

        <p>Release Date: ${releaseDate}</p>

        <p>Rating: ${rating}</p>

    <p>Total Ratings: ${totalRatings}</p>

    <p>Has Cover: ${hasCover}</p>

        <p>Updated: ${updated}</p>

    `;

}

function createEmptyCard(title, message) {

    return `

        <div class="card">

            <h3>${title}</h3>

            <p>${message}</p>

        </div>

    `;

}

function displayGames(games) {
    
const isLoggedIn =
        !!localStorage.getItem("token");

    const results =
        document.getElementById("results");

    results.innerHTML = "";

    if (games.length === 0) {

        results.innerHTML =
            createEmptyCard(
                "No Games Found",
                "Try searching for a different game."
            );

        return;

    }

    games.forEach(game => {

        const card =
            document.createElement("div");

        card.classList.add("card");

        const isFavorite =
            favoriteGameIds.includes(
                Number(game.id)
            );

        const isPlayed =
            playedGameIds.includes(
                Number(game.id)
            );

        card.innerHTML =

            createGameCard(game)

            +

            `

            ${isLoggedIn ? `

                ${isFavorite ? `

                    <button
                        type="button"
                        disabled
                        style="
                            background-color: green;
                            color: white;
                        "
                    >
                        ✓ Already in Favorites
                    </button>

                ` : `

                    <button
                        type="button"
                        onclick="addFavorite('${game.id}', this)"
                    >
                        Add to Favorites
                    </button>

                `}

                ${isPlayed ? `

                    <button
                        type="button"
                        disabled
                        style="
                            background-color: green;
                            color: white;
                        "
                    >
                        ✓ Already in Played
                    </button>

                ` : `

                    <button
                        type="button"
                        onclick="addPlayed('${game.id}', this)"
                    >
                        Add to Played
                    </button>

                `}

            ` : ""}

            `;

        results.appendChild(card);

    });

}
