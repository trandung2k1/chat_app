const jwt = require('jsonwebtoken');
require('dotenv').config();
const generatedAccessToken = (user) => {
    return jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '20m',
    });
};
module.exports = generatedAccessToken;
