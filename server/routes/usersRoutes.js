const express = require("express");
const { validateToken } = require("../middlewares/AuthMiddlewares");
const bcrypt = require("bcrypt");

const User = require("../models/User");
const router = express.Router();


router.get('/all-users', validateToken(["admin"]), async (req, res) => {
    try {

        const users = await User.find().select("email role")

        res.status(200).json(users)


    } catch (err) {
        res.status(500).json({ error: `error getting users: ${err}` })
    }
})

router.put('/reset-user-password', validateToken(["admin"]), async (req, res) => {
    const { userId, password } = req.body
    try {

        const user = await User.findById(userId)

        const hashedPassword = await bcrypt.hash(password, 10);

        user.password = hashedPassword;

        await user.save()

        res.status(200).json("success")


    } catch (err) {
        res.status(500).json({ error: `error editing user: ${err}` })
    }

})


module.exports = router
