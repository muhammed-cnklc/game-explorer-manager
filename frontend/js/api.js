/* Configuration */

const API_URL = "http://localhost:3000/api";

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
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({username,email,password})
            }
        );
        const data = await response.json();

        document.getElementById("message").innerText = data.message;

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
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({email,password})
            }
        );
        const data = await response.json();

        if (data.token) {
            localStorage.setItem("token",data.token);

            window.location.href = "index.html"; 

        } else {
            document.getElementById("loginMessage").innerText = data.message;
        }

    } catch (error) {
        document.getElementById("loginMessage").innerText = error.message;
    }
}

function requireLogin() {

    const token =localStorage.getItem("token");

    if (!token) {
        window.location.href ="login.html";
    }
}

function logoutUser() {

    localStorage.removeItem("token");

    window.location.href = "login.html";
}

/* Games */

async function searchGames(event) {

    event.preventDefault();

    const searchTerm = document.getElementById("searchInput").value;

    try {
        const response = await fetch(`${API_URL}/games/search?q=${searchTerm}`);
        const games = await response.json();

        displayGames(games);

    } catch (error) {
        console.error(error);
    }
}

function displayGames(games) {

    const results = document.getElementById("results");

    results.innerHTML = "";

    games.forEach(game => {

        const card = document.createElement("div");

        card.classList.add("card");

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

        const aggregatedRating =
            game.aggregatedRating
                ? game.aggregatedRating.toFixed(1)
                : "N/A";

        card.innerHTML = `
            <h3>${game.name}</h3>

            <img src="${game.cover}" alt="${game.name}">

            <p>ID: ${game.id}</p>

            <p>Rating: ${rating}</p>

            <p>
                Aggregated Rating:
                ${aggregatedRating}
            </p>

            <p>Hypes: ${game.hypes}</p>

            <p>
                Release Date:
                ${releaseDate}
            </p>

            <button
                onclick="addFavorite('${game.id}')"
            >
                Add to Favorites
            </button>

            <button
                onclick="addPlayed('${game.id}')"
            >
                Add to Played
            </button>
        `;

        results.appendChild(card);
    });
}

/* Favorites */

async function addFavorite(gameId) {

    const token = localStorage.getItem("token");

    if (!token) {
        alert("Please login first");
        
        return;
    }

    const response = await fetch(`${API_URL}/favorites`,
        {
            method: "POST",
            headers: {"Content-Type": "application/json", "Authorization": `Bearer ${token}`},
            body: JSON.stringify({rawg_game_id: gameId})
        }
    );
    const data = await response.json();

    alert(data.message);
}

async function loadFavorites() {

    const token = localStorage.getItem("token");

    if (!token) {
        alert("Please login first");
        
        return;
    }

    try {

        const response = await fetch(
            `${API_URL}/favorites`,
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        const favorites = await response.json();

        const favoritesWithDetails = await Promise.all(

            favorites.map(async (favorite) => {

                const gameResponse = await fetch(
                    `${API_URL}/games/${favorite.rawg_game_id}`
                );

                const game = await gameResponse.json();

                return {
                    ...favorite,
                    game
                };

            })

        );

        displayFavorites(favoritesWithDetails);

    } catch (error) {

        console.error(error);

    }

}

function displayFavorites(favorites) {

    const container =
        document.getElementById("favoritesContainer");

    if (!container) {
        
        return;
    }

    container.innerHTML = "";

    favorites.forEach(favorite => {

        const game = favorite.game;

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

        const card =
            document.createElement("div");

        card.classList.add("card");

        card.innerHTML = `
            ${game.cover
                ? `<img src="${game.cover}" alt="${game.name}">`
                : ""
            }

            <h3>${game.name}</h3>

            <p>Rating: ${rating}</p>

            <p>Release Date: ${releaseDate}</p>

            <button onclick="deleteFavorite(${favorite.id})">
                Remove
            </button>
        `;

        container.appendChild(card);

    });

}

async function deleteFavorite(id) {

    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/favorites/${id}`,
        {
            method: "DELETE",
            headers: {"Authorization": `Bearer ${token}`}
        }
    );
    const data = await response.json();

    alert(data.message);

    loadFavorites();
}

/* Played Games */

async function addPlayed(gameId) {

    const token = localStorage.getItem("token");

    if (!token) {
        alert("Please login first");
        
        return;
    }

    const response = await fetch(`${API_URL}/played`,
        {
            method: "POST",
            headers: {"Content-Type": "application/json","Authorization": `Bearer ${token}`},
            body: JSON.stringify({rawg_game_id: gameId,status: "Playing"})
        }
    );
    const data = await response.json();

    alert(data.message);
}

async function loadPlayedGames() {

    const token = localStorage.getItem("token");

    if (!token) {
        alert("Please login first");
        return;
    }

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
                    `${API_URL}/games/${playedGame.rawg_game_id}`
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
        document.getElementById("playedContainer");

    if (!container) {

        return;
    }

    container.innerHTML = "";

    playedGames.forEach(playedGame => {

        const game =
            playedGame.game;

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

        const card =
            document.createElement("div");

        card.classList.add("card");

        card.innerHTML = `

            ${game.cover
                ? `<img src="${game.cover}" alt="${game.name}">`
                : ""
            }

            <h3>${game.name}</h3>

            <p>Rating: ${rating}</p>

            <p>Release Date: ${releaseDate}</p>

            <p>Status: ${playedGame.status}</p>

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
                onclick="deletePlayedGame(${playedGame.id})"
            >
                Remove
            </button>

        `;

        container.appendChild(card);

    });

}

async function updatePlayedGame(id,status) {

    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/played/${id}`,
        {
            method: "PUT",
            headers: {"Content-Type": "application/json","Authorization": `Bearer ${token}`},
            body: JSON.stringify({status})
        }
    );
    const data = await response.json();

    console.log(data.message);
}

async function deletePlayedGame(id) {

    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/played/${id}`,
        {
            method: "DELETE",
            headers: {"Authorization": `Bearer ${token}`}
        }
    );
    const data = await response.json();

    alert(data.message);

    loadPlayedGames();
}

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
                                `${API_URL}/games/${featuredGame.rawg_game_id}`
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

function displayFeaturedGames(featuredGames) {

    const container =
        document.getElementById(
            "featuredContainer"
        );

    if (!container) {
        return;
    }

    container.innerHTML = "";

    featuredGames.forEach(featuredGame => {

        const game =
            featuredGame.game;

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

        const card =
            document.createElement("div");

        card.classList.add("card");

        card.innerHTML = `

            ${game.cover
                ? `<img src="${game.cover}" alt="${game.name}">`
                : ""
            }

            <h3>${game.name}</h3>

            <p>Rating: ${rating}</p>

            <p>
                Release Date:
                ${releaseDate}
            </p>

            <button
                onclick="deleteFeaturedGame(${featuredGame.id})"
            >
                Remove
            </button>

        `;

        container.appendChild(card);

    });

}


async function addFeaturedGame(event) {

    event.preventDefault();

    const token = localStorage.getItem("token");
    const rawg_game_id = document.getElementById("featuredGameId").value;
    const response = await fetch(`${API_URL}/admin/featured`,
        {
            method: "POST",
            headers: {"Content-Type": "application/json", "Authorization": `Bearer ${token}`},
            body: JSON.stringify({rawg_game_id})
        }
    );
    const data = await response.json();

    alert(data.message);

    loadFeaturedGames();

}

async function deleteFeaturedGame(id) {

    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/admin/featured/${id}`,
        {
            method: "DELETE",
            headers: {"Authorization": `Bearer ${token}`}
        }
    );
    const data = await response.json();

    alert(data.message);

    loadFeaturedGames();
}

/* Event Listeners */

const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", registerUser);
}

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", loginUser);
}

const searchForm = document.getElementById("searchForm");

if (searchForm) {
    searchForm.addEventListener("submit", searchGames);
}

const featuredForm = document.getElementById("featuredForm");

if (featuredForm) {
    featuredForm.addEventListener("submit", addFeaturedGame);
}

/* Page Initialization */

if (document.getElementById("favoritesContainer")) {
    loadFavorites();
}

if (document.getElementById("playedContainer")) {
    loadPlayedGames();
}

if (document.getElementById("featuredContainer")) {
    loadFeaturedGames();
}
