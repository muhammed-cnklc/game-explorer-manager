const db = require("../database/db");

// Add a game to favorites
exports.addFavorite = (req, res) => {

    const { game_id } = req.body;
    const userId = req.user.id;
    const checkSql = `
        SELECT *
        FROM favorite_games
        WHERE user_id = ?
        AND game_id = ?
    `;

    db.get(
        checkSql,
        [userId, game_id],
        (err, existingFavorite) => {

            if (err) {
                return res.status(500).json({
                    message: err.message
                });
            }

            if (existingFavorite) {
                return res.status(400).json({
                    message: "Already in favorites"
                });
            }

            const sql = `
            INSERT INTO favorite_games
            (user_id, game_id)
            VALUES (?, ?)
        `;

            db.run(
                sql,
                [userId, game_id],
                function (err) {

                    if (err) {
                        return res.status(500).json({
                            message: err.message
                        });
                    }

                    res.status(201).json({
                        message: "Favorite added",
                        favoriteId: this.lastID
                    });
                }
            );
        }
    );
};

// Get all favorites for the current user
exports.getFavorites = (req, res) => {

    const userId = req.user.id;
    const sql = `
        SELECT *
        FROM favorite_games
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

// Remove a favorite game
exports.deleteFavorite = (req, res) => {

    const favoriteId = req.params.id;
    const userId = req.user.id;
    const sql = `
        DELETE FROM favorite_games
        WHERE id = ?
        AND user_id = ?
    `;

    db.run(
        sql,
        [favoriteId, userId],
        function (err) {

            if (err) {
                return res.status(500).json({
                    message: err.message
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    message: "Favorite not found"
                });
            }

            res.json({
                message: "Favorite deleted"
            });
        }
    );
};