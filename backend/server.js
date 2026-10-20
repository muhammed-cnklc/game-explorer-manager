require("dotenv").config();

const express = require("express");
const fs = require("fs");
const path = require("path");

const db = require("./database/db");

const authRoutes = require("./routes/authRoutes");
const { verifyToken } = require("./middleware/authMiddleware");

const app = express();

// Parse JSON request bodies
app.use(express.json());

// Authentication routes
app.use("/api/auth", authRoutes);

// Home endpoint
app.get("/", (req, res) => {
    res.send("API Running");
});

// Health check endpoint
app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        message: "Backend is running"
    });
});

// Protected test endpoint
app.get("/api/profile", verifyToken, (req, res) => {
    res.json({
        message: "Protected route accessed",
        user: req.user
    });
});

// Load database schema
const schema = fs.readFileSync(
    path.join(__dirname, "database", "schema.sql"),
    "utf8"
);

// Create tables if they do not exist
db.exec(schema, (err) => {
    if (err) {
        console.error("Schema error:", err.message);
    } else {
        console.log("Database tables created");
    }
});

// Start Express server
app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
});