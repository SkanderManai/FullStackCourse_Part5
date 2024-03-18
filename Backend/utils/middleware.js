const logger = require("./logger");
const jwt = require("jsonwebtoken");

const errorHandler = (error, request, response, next) => {
    logger.error(error.message);

    if (error.name === "ValidationError") {
        return response.status(400).json({ error: error.message });
    } else if (error.name === "JsonWebTokenError") {
        return response.status(401).json({ error: "token missing or invalid" });
    }

    next(error);
};

const tokenExtractor = (req, res, next) => {
    const authorization = req.get("Authorization");
    if (authorization && authorization.startsWith("Bearer ")) {
        req.token = authorization.replace("Bearer ", "");
    }
    next();
};

const userExtractor = (req, res, next) => {
    if (req.token) {
        const decodedToken = jwt.verify(req.token, process.env.SECRET);
        req.user = decodedToken.username;
    }
    next();
};

module.exports = { errorHandler, tokenExtractor, userExtractor };
