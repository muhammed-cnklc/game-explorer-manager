const express = require("express");

const router = express.Router();

const adminController =
    require("../controllers/adminController");

const {
    verifyToken
} = require("../middleware/authMiddleware");

const {
    isAdmin
} = require("../middleware/roleMiddleware");

router.get(
    "/users",
    verifyToken,
    isAdmin,
    adminController.getUsers
);

router.delete(
    "/users/:id",
    verifyToken,
    isAdmin,
    adminController.deleteUser
);

router.get(
    "/statistics",
    verifyToken,
    isAdmin,
    adminController.getStatistics
);

// Public featured list
router.get(
    "/featured",
    adminController.getFeaturedGames
);

// Admin only
router.post(
    "/featured",
    verifyToken,
    isAdmin,
    adminController.addFeaturedGame
);

// Admin only
router.delete(
    "/featured/:id",
    verifyToken,
    isAdmin,
    adminController.deleteFeaturedGame
);

module.exports = router;