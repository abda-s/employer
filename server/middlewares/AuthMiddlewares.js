const { verify } = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const validateToken = roles => {
    return (req, res, next) => {
        const accessToken = req.header("accessToken");

        if (!accessToken) {
            return res.json({ error: "User not logged in!" });
        }

        try {
            const validToken = verify(accessToken, process.env.JWT_SECRET);
            req.user = validToken;

            if (roles && roles.length > 0 && !roles.includes(validToken.role)) {
                return res.json({ error: "Access denied" });
            }

            if (validToken) {
                return next();
            }

        } catch (err) {
            return res.json({ error: err.message });
        }
    };
};

module.exports = { validateToken };
