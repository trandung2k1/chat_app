const { Router } = require('express');
const AuthController = require('../controllers/auth.controller');
const { verifyToken } = require('../middlewares/auth');
const router = Router();
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/get-all-users', verifyToken, AuthController.getAllUsers);
module.exports = router;
