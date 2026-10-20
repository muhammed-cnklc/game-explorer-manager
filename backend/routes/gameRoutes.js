const express = require("express");

const router = express.Router();

const gameController = require("../controllers/gameController");

// Search games
router.get("/search", gameController.searchGames);

// Game details
router.get("/:id", gameController.getGameDetails);

module.exports = router;