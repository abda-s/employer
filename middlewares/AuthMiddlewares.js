const { verify } = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const validateToken = role => {
    return (req, res, next) => {
        const accessToken = req.header("accessToken");
        if (!accessToken) {
            return res.json({ error: "User not logged in!" });
        }

        try {
            const validToken = verify(accessToken, process.env.JWT_SECRET);
            req.user = validToken;
            // console.log("validToken: ", validToken);

            if (role && role.length > 0 && !role.includes(validToken.role)) {
                console.log(role);
                console.log(validToken.role);
                return res.json({ error: "Access denied" });
            }

            if (validToken) {
                console.log("verified");
                return next();
            }

        } catch (err) {
            return res.json({ error: err.message });
        }
    };
};

module.exports = { validateToken };
