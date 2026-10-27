const APIService = require("../services/APIService");

// Search games
exports.searchGames = async (req, res) => {

    try {

        const query = req.query.q;

        if (!query) {
            return res.status(400).json({
                message: "Search query required"
            });
        }

        const games = await APIService.searchGames(query);

        res.json(games);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};

// Game details
exports.getGameDetails = async (req, res) => {

    try {

        const gameId = req.params.id;
        const game = await APIService.getGameDetails(gameId);

        res.json(game);
        
    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};