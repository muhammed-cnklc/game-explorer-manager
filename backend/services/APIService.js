require("dotenv").config();

const axios = require("axios");

async function getAccessToken() {

    const response =
        await axios.post(
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

}

async function getCoverUrl(
    coverId,
    token
) {

    const response =
        await axios.post(
            "https://api.igdb.com/v4/covers",

            `
            fields
                image_id;
            where
                id = ${coverId};
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

    if (
        !response.data.length
    ) {
        return null;
    }

    const imageId =
        response.data[0].image_id;

    return `https://images.igdb.com/igdb/image/upload/t_cover_big/${imageId}.jpg`;

}

exports.searchGames = async (query) => {

    const token =
        await getAccessToken();

    const response =
        await axios.post(
            "https://api.igdb.com/v4/games",

            `
            search "${query}";
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

    const games = await Promise.all(

    response.data.map(async (game) => {

        const coverUrl =
            game.cover
                ? await getCoverUrl(
                    game.cover,
                    token
                )
                : null;

        return {

            id: game.id,

            name: game.name,

            released:
                game.first_release_date || null,

            rating:
                game.rating || 0,

            aggregatedRating:
                game.aggregated_rating || 0,

            hypes:
                game.hypes || 0,

            hasCover:
                !!game.cover,

            cover:
                coverUrl,

            updated:
                game.updated_at || null
        };

    })

);

return games;

};

exports.getGameDetails = async (gameId) => {

    const token =
        await getAccessToken();

    const response =
        await axios.post(
            "https://api.igdb.com/v4/games",

            `
            fields
                id,
                name,
                first_release_date,
                rating,
                aggregated_rating,
                hypes,
                cover,
                updated_at;
            where
                id = ${gameId};
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

    if (!response.data.length) {
        return null;
    }

    const game =
        response.data[0];

    const coverUrl =
        game.cover
            ? await getCoverUrl(
                game.cover,
                token
            )
            : null;

    return {

        id: game.id,

        name: game.name,

        released:
            game.first_release_date || null,

        rating:
            game.rating || 0,

        aggregatedRating:
            game.aggregated_rating || 0,

        hypes:
            game.hypes || 0,

        hasCover:
            !!game.cover,

        cover:
            coverUrl,

        updated:
            game.updated_at || null
    };

};
