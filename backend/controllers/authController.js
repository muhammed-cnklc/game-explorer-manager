const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../database/db");

// Register new user
exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validate input
        if (!username || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = `
            INSERT INTO users (username, email, password_hash)
            VALUES (?, ?, ?)
        `;

        db.run(
            sql,
            [username, email, hashedPassword],
            function (err) {
                if (err) {
                    return res.status(500).json({
                        message: err.message
                    });
                }

                res.status(201).json({
                    message: "User registered successfully",
                    userId: this.lastID
                });
            }
        );

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Login existing user
exports.login = (req, res) => {
    const { email, password } = req.body;

    const sql = `
        SELECT *
        FROM users
        WHERE email = ?
    `;

    db.get(sql, [email], async (err, user) => {

        if (err) {
            return res.status(500).json({
                message: err.message
            });
        }

        if (!user) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        // Compare password with stored hash
        const validPassword = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!validPassword) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                id: user.id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "24h"
            }
        );

        res.json({
            message: "Login successful",
            token
        });
    });
};