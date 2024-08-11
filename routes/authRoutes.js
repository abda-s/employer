const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");
const User = require('../models/User');

const dotenv = require("dotenv");
dotenv.config();


router.post('/signup', async (req, res) => {
    const { email, password } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        // Await the promise returned by Users.findOne
        const existingUser = await User.findOne({ email: email });

        if (existingUser) {
            return res.json({ error: "email already exists" });
        }

        const user = new User({
            email,
            password: hashedPassword,
        });

        // Await the promise returned by user.save()
        await user.save();
        res.status(200).json("success");

    } catch (err) {
        console.error("Error creating user:", err);
        res.status(500).json({ error: `Failed to create user: ${err.message}` });
    }
});



router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.json({ error: "Email doesn't exist" });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.json({ error: "Wrong password" });
        }

        const accessToken = sign(
            { email: user.email, id: user.id, role: user.role },
            process.env.JWT_SECRET
        );
        res.json({
            token: accessToken,
            email: user.email,
            id: user.id,
            role: user.role,
        });
        console.log("You have successfully logged in");

    } catch (err) {
        console.log("error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});




module.exports = router