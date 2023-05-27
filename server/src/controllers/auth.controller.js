const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const generatedAccessToken = require('../utils/generateToken');
class AuthController {
    static async register(req, res) {
        const { name, email, avatar } = req.body;
        if (!name || !email || !req.body.password) {
            return res.status(400).json({
                message: 'Name, email and password must be provided',
            });
        }
        try {
            const userExits = await User.findOne({ email });
            if (userExits) {
                return res.status(400).json({
                    message: 'User already exists',
                });
            }
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            const newUser = new User({
                name,
                email,
                password: hashedPassword,
                avatar,
            });
            const savedUser = await newUser.save();
            const { password, ...info } = savedUser._doc;
            return res.status(201).json(info);
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: error.message,
            });
        }
    }
    static async login(req, res) {
        const { email } = req.body;
        if (!email || !req.body.password) {
            return res.status(400).json({
                message: 'Email and password must be provided',
            });
        }
        try {
            const findUser = await User.findOne({ email });
            if (!findUser) {
                return res.status(404).json({
                    message: 'User not found',
                });
            }
            const isValidPassword = await bcrypt.compare(req.body.password, findUser.password);
            if (!isValidPassword) {
                return res.status(400).json({
                    message: 'Wrong password',
                });
            }
            const { password, ...info } = findUser._doc;
            const accessToken = generatedAccessToken(info);
            return res.status(200).json({
                ...info,
                accessToken,
            });
        } catch (error) {
            return res.status(500).json({
                message: error.message,
            });
        }
    }
    static async getAllUsers(req, res) {
        const keyword = req.query.search
            ? {
                  $or: [
                      { name: { $regex: req.query.search, $options: 'i' } },
                      { email: { $regex: req.query.search, $options: 'i' } },
                  ],
              }
            : {};
        try {
            const users = await User.findOne(keyword).find({ _id: { $ne: req.user.userId } });
            return res.status(200).json(users);
        } catch (error) {
            return res.status(500).json({
                message: error.message,
            });
        }
    }
}

module.exports = AuthController;
