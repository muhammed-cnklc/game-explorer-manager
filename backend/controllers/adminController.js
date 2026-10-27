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

    const { game_id } = req.body;
    const featuredBy = req.user.id;
    const checkSql = `
        SELECT *
        FROM featured_games
        WHERE game_id = ?
    `;

    db.get(
        checkSql,
        [game_id],
        (err, existingFeaturedGame) => {

            if (err) {
                return res.status(500).json({
                    message: err.message
                });
            }

            if (existingFeaturedGame) {
                return res.status(400).json({
                    message: "Game already featured"
                });
            }

            const sql = `
                INSERT INTO featured_games
                (game_id, featured_by)
                VALUES (?, ?)
            `;

            db.run(
                sql,
                [game_id, featuredBy],
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

// Get all users
exports.getUsers = (req, res) => {

    const sql = `
        SELECT
            id,
            username,
            email,
            role,
            created_at
        FROM users
        ORDER BY role DESC, username ASC
    `;

    db.all(
        sql,
        [],
        (err, users) => {

            if (err) {
                return res.status(500).json({
                    message: err.message
                });
            }

            res.json(users);

        }
    );
};

// Delete a user
exports.deleteUser = (req, res) => {

    const userId = req.params.id;
    const checkSql = `
        SELECT *
        FROM users
        WHERE id = ?
    `;

    db.get(
        checkSql,
        [userId],
        (err, user) => {

            if (err) {
                return res.status(500).json({
                    message: err.message
                });
            }

            if (!user) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            if (user.role === "admin") {
                return res.status(403).json({
                    message: "Admins cannot be deleted"
                });
            }

            db.run(
                `
                DELETE FROM favorite_games
                WHERE user_id = ?
                `,
                [userId],
                (err) => {

                    if (err) {
                        return res.status(500).json({
                            message: err.message
                        });
                    }

                    db.run(
                        `
                        DELETE FROM played_games
                        WHERE user_id = ?
                        `,
                        [userId],
                        (err) => {

                            if (err) {
                                return res.status(500).json({
                                    message: err.message
                                });
                            }

                            db.run(
                                `
                                DELETE FROM users
                                WHERE id = ?
                                `,
                                [userId],
                                function (err) {

                                    if (err) {
                                        return res.status(500).json({
                                            message: err.message
                                        });
                                    }

                                    res.json({
                                        message: "User deleted"
                                    });

                                }
                            );
                        }
                    );
                }
            );
        }
    );
};

// Get dashboard statistics
exports.getStatistics = (req, res) => {

    db.get(
        `
        SELECT COUNT(*) AS totalUsers
        FROM users
        `,
        [],
        (err, usersResult) => {

            if (err) {
                return res.status(500).json({
                    message: err.message
                });
            }

            db.get(
                `
                SELECT COUNT(*) AS totalFavorites
                FROM favorite_games
                `,
                [],
                (err, favoritesResult) => {

                    if (err) {
                        return res.status(500).json({
                            message: err.message
                        });
                    }

                    db.get(
                        `
                        SELECT COUNT(*) AS totalPlayedGames
                        FROM played_games
                        `,
                        [],
                        (err, playedResult) => {

                            if (err) {
                                return res.status(500).json({
                                    message: err.message
                                });
                            }

                            db.get(
                                `
                                SELECT COUNT(*) AS totalFeaturedGames
                                FROM featured_games
                                `,
                                [],
                                (err, featuredResult) => {

                                    if (err) {
                                        return res.status(500).json({
                                            message: err.message
                                        });
                                    }

                                    res.json({
                                        totalUsers:
                                            usersResult.totalUsers,

                                        totalFavorites:
                                            favoritesResult.totalFavorites,

                                        totalPlayedGames:
                                            playedResult.totalPlayedGames,

                                        totalFeaturedGames:
                                            featuredResult.totalFeaturedGames
                                    });
                                }
                            );
                        }
                    );
                }
            );
        }
    );
};