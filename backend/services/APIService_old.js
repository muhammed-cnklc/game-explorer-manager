const axios = require("axios");

const headers = {
    "User-Agent":
        "GameExplorerManager/1.0 (muhammed.cankilic@stud.hcw.ac.at)"
};

// Search games by title
exports.searchGames = async (query) => {

    const response = await axios.get(
        `https://www.cheapshark.com/api/1.0/games?title=${query}`,
        { headers }
    );

    return response.data;

};

// Get game details
exports.getGameDetails = async (gameId) => {

    const response = await axios.get(
        `https://www.cheapshark.com/api/1.0/games?id=${gameId}`,
        { headers }
    );

    return response.data;

};