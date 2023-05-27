const jwt = require('jsonwebtoken');
const verifyToken = (req, res, next) => {
    const tokenString = req.headers.authorization;
    if (tokenString) {
        const accessToken = tokenString.split(' ')[1];
        jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, async (error, decoded) => {
            if (error) {
                if (error.name === 'TokenExpiredError')
                    return res.status(401).json({
                        message: 'Token expired',
                    });
                else if (error.name === 'JsonWebTokenError') {
                    return res.status(400).json({
                        message: error.message,
                    });
                } else {
                    return res.status(400).json({
                        message: error?.message,
                    });
                }
            } else {
                req.user = decoded;
                next();
            }
        });
    } else {
        return res.status(401).json({
            message: 'Token not found',
        });
    }
};
module.exports = { verifyToken };
