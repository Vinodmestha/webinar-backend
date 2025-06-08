const jwt = require("jsonwebtoken");
const { isBlacklisted } = require("../helpers/blacklist");
const { apiResponse } = require("../helpers/apiResponse");

const tokenAuth = (req, res, next) => {
    const token = req?.headers?.authorization?.split(" ")[1];

    if (token) {
        if (isBlacklisted(token)) {
            return apiResponse(res, true, 401, "Token is blacklisted");
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        } catch (error) {
            return apiResponse(res, true, 401, "Invalid token");
        }
    } else {
        return apiResponse(res, true, 401, "No token provided");
    }
};

module.exports = { tokenAuth };
