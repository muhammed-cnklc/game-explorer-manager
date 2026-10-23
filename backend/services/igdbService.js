require("dotenv").config();

const axios = require("axios");

async function getAccessToken() {

    try {

        const response = await axios.post(
            "https://id.twitch.tv/oauth2/token",
            null,
            {
                params: {
                    client_id:
                        process.env.TWITCH_CLIENT_ID,

                    client_secret:
                        process.env.TWITCH_CLIENT_SECRET,

                    grant_type:
                        "client_credentials"
                }
            }
        );

        return response.data.access_token;

    } catch (error) {

        console.error(
            "Error getting Twitch token:",
            error.response?.data ||
            error.message
        );

        throw error;

    }

}

async function searchGames(searchTerm) {

    const token =
        await getAccessToken();

    try {

        const response =
            await axios.post(
                "https://api.igdb.com/v4/games",

                `
                search "${searchTerm}";
                fields
                    id,
                    name,
                    first_release_date,
                    rating,
                    aggregated_rating,
                    hypes,
                    cover,
                    updated_at;
                limit 10;
                `,

                {
                    headers: {
                        "Client-ID":
                            process.env.TWITCH_CLIENT_ID,

                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

        return response.data.map(game => ({
    id: game.id,

    name: game.name,

    released:
        game.first_release_date || null,

    rating:
        game.rating || null,

    aggregatedRating:
        game.aggregated_rating || null,

    hypes:
        game.hypes || 0,

    hasCover:
        !!game.cover,

    cover:
        game.cover || null,

    updated:
        game.updated_at || null
}));

    } catch (error) {

        console.error(
            "IGDB Search Error:",
            error.response?.data ||
            error.message
        );

        throw error;

    }

}

module.exports = {
    getAccessToken,
    searchGames
};