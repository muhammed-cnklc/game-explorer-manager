const express = require("express");

const router = express.Router();

const favoriteController =
    require("../controllers/favoriteController");

const {
    verifyToken
} = require("../middleware/authMiddleware");

// Add favorite game
router.post(
    "/",
    verifyToken,
    favoriteController.addFavorite
);

// Get user favorites
router.get(
    "/",
    verifyToken,
    favoriteController.getFavorites
);

// Remove favorite
router.delete(
    "/:id",
    verifyToken,
    favoriteController.deleteFavorite
);

module.exports = router;