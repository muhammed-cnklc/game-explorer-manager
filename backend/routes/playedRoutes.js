const express = require("express");

const router = express.Router();

const playedController =
    require("../controllers/playedController");

const {
    verifyToken
} = require("../middleware/authMiddleware");

// Add played game
router.post(
    "/",
    verifyToken,
    playedController.addPlayedGame
);

// Get played games
router.get(
    "/",
    verifyToken,
    playedController.getPlayedGames
);

// Update status
router.put(
    "/:id",
    verifyToken,
    playedController.updatePlayedGame
);

// Delete played game
router.delete(
    "/:id",
    verifyToken,
    playedController.deletePlayedGame
);

module.exports = router;