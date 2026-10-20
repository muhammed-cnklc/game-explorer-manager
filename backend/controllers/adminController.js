const db = require("../database/db");

// Get all featured games
exports.getFeaturedGames = (req, res) => {

    const sql = `
        SELECT *
        FROM featured_games
    `;

    db.all(sql, [], (err, rows) => {

        if (err) {
            return res.status(500).json({
                message: err.message
            });
        }

        res.json(rows);

    });

};

// Add a featured game
exports.addFeaturedGame = (req, res) => {

    const { rawg_game_id } = req.body;
    const adminId = req.user.id;

    const sql = `
        INSERT INTO featured_games
        (rawg_game_id, featured_by)
        VALUES (?, ?)
    `;

    db.run(
        sql,
        [rawg_game_id, adminId],
        function (err) {

            if (err) {
                return res.status(500).json({
                    message: err.message
                });
            }

            res.status(201).json({
                message: "Featured game added",
                featuredId: this.lastID
            });

        }
    );

};

// Remove a featured game
exports.deleteFeaturedGame = (req, res) => {

    const featuredId = req.params.id;

    const sql = `
        DELETE FROM featured_games
        WHERE id = ?
    `;

    db.run(
        sql,
        [featuredId],
        function (err) {

            if (err) {
                return res.status(500).json({
                    message: err.message
                });
            }

            res.json({
                message: "Featured game deleted"
            });

        }
    );

};