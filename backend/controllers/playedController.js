const db = require("../database/db");

// Add a played game
exports.addPlayedGame = (req, res) => {

    const { rawg_game_id, status } = req.body;
    const userId = req.user.id;

    const sql = `
        INSERT INTO played_games
        (user_id, rawg_game_id, status)
        VALUES (?, ?, ?)
    `;

    db.run(
        sql,
        [userId, rawg_game_id, status],
        function (err) {

            if (err) {
                return res.status(500).json({
                    message: err.message
                });
            }

            res.status(201).json({
                message: "Played game added",
                playedId: this.lastID
            });

        }
    );

};

// Get all played games for the current user
exports.getPlayedGames = (req, res) => {

    const userId = req.user.id;

    const sql = `
        SELECT *
        FROM played_games
        WHERE user_id = ?
    `;

    db.all(
        sql,
        [userId],
        (err, rows) => {

            if (err) {
                return res.status(500).json({
                    message: err.message
                });
            }

            res.json(rows);

        }
    );

};

// Update the game status
exports.updatePlayedGame = (req, res) => {

    const playedId = req.params.id;
    const { status } = req.body;
    const userId = req.user.id;

    const sql = `
        UPDATE played_games
        SET status = ?
        WHERE id = ?
        AND user_id = ?
    `;

    db.run(
        sql,
        [status, playedId, userId],
        function (err) {

            if (err) {
                return res.status(500).json({
                    message: err.message
                });
            }

            res.json({
                message: "Played game updated"
            });

        }
    );

};

// Remove a played game
exports.deletePlayedGame = (req, res) => {

    const playedId = req.params.id;
    const userId = req.user.id;

    const sql = `
        DELETE FROM played_games
        WHERE id = ?
        AND user_id = ?
    `;

    db.run(
        sql,
        [playedId, userId],
        function (err) {

            if (err) {
                return res.status(500).json({
                    message: err.message
                });
            }

            res.json({
                message: "Played game deleted"
            });

        }
    );

};