const { verify } = require("jsonwebtoken");

const validateToken = role => {
    return (req, res, next) => {
        const accessToken = req.header("accessToken");
        if (!accessToken) {
            return res.json({ error: "User not logged in!" });
        }

        try {
            const validToken = verify(accessToken, "theJWTsecret");
            req.user = validToken;
            console.log("validToken: ", validToken.role);

            if (role && role.length > 0 && !role.includes(validToken.role)) {
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
