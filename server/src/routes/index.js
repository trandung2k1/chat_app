const auth = require('./auth.route');
const chat = require('./chat.route');
const routes = (app) => {
    app.use('/api/auth', auth);
    app.use('/api/chat', chat);
};

module.exports = routes;
