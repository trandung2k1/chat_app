const Chat = require('../models/chat.model');
const User = require('../models/user.model');
class ChatController {
    static async accessChat(req, res) {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({
                message: 'UserId param not sent with request',
            });
        }
        let isChat = await Chat.find({
            isGroupChat: false,
            $and: [
                { users: { $elemMatch: { $eq: req.user.userId } } },
                { users: { $elemMatch: { $eq: userId } } },
            ],
        })
            .populate('users', '-password')
            .populate('latestMessage');

        isChat = await User.populate(isChat, {
            path: 'latestMessage.sender',
            selector: 'name avatar email',
        });
        if (isChat.length > 0) {
            return res.status(200).json(isChat[0]);
        } else {
            let chatData = {
                chatName: 'sender',
                isGroupChat: false,
                users: [req.user.userId, userId],
            };
            try {
                const createdChat = await Chat.create(chatData);
                const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
                    'users',
                    '-password',
                );
                return res.status(201).json(fullChat);
            } catch (error) {
                return res.status(500).json({
                    message: error.message,
                });
            }
        }
    }
    static async fetchChats(req, res) {
        try {
            const chats = await Chat.find({ users: { $elemMatch: { $eq: req.user.userId } } })
                .populate('users', '-password')
                .populate('groupAdmin', '-password')
                .populate('latestMessage')
                .sort({ updatedAt: -1 });
            const rs = await User.populate(chats, {
                path: 'latestMessage.sender',
                selector: 'name avatar email',
            });
            return res.status(200).json(rs);
        } catch (error) {
            return res.status(500).json({
                message: error.message,
            });
        }
    }
    static async createGroupChat(req, res) {
        if (!req.body.users || !req.body.chatName) {
            return res.status(400).json({
                message: 'Chat name and users is required',
            });
        }
        let users = req.body.users;
        if (users.length < 2) {
            return res.status(400).json({
                message: 'More than 2 users are required to from group chat',
            });
        }
        users.push(req.user.userId);
        try {
            const groupChat = await Chat.create({
                chatName: req.body.chatName,
                users: users,
                isGroupChat: true,
                groupAdmin: req.user.userId,
            });
            const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
                .populate('users', '-password')
                .populate('groupAdmin', '-password');
            return res.status(201).json(fullGroupChat);
        } catch (error) {
            return res.status(500).json({
                message: error.message,
            });
        }
    }
    static async renameGroup(req, res) {
        const { chatId, chatName } = req.body;
        try {
            const findAdmin = await Chat.findById(chatId);
            if (findAdmin.groupAdmin != req.user.userId) {
                return res.status(401).json({
                    message: 'You are not allowed to do that',
                });
            }
            const updatedChat = await Chat.findByIdAndUpdate(
                chatId,
                {
                    chatName,
                },
                {
                    new: true,
                },
            )
                .populate('users', '-password')
                .populate('groupAdmin', '-password');
            if (!updatedChat) {
                return res.status(404).json({
                    message: 'Chat not found',
                });
            }
            return res.status(200).json(updatedChat);
        } catch (error) {
            return res.status(500).json({
                message: error.message,
            });
        }
    }
    static async addToGroup(req, res) {
        const { chatId, userId } = req.body;
        try {
            const added = await Chat.findByIdAndUpdate(
                chatId,
                {
                    $push: { users: userId },
                },
                {
                    new: true,
                },
            )
                .populate('users', '-password')
                .populate('groupAdmin', '-password');
            if (!added) {
                return res.status(404).json({
                    message: 'Chat not found',
                });
            }
            return res.status(200).json(added);
        } catch (error) {
            return res.status(500).json({
                message: error.message,
            });
        }
    }
    static async removeFromGroup(req, res) {
        const { chatId, userId } = req.body;
        try {
            const findAdmin = await Chat.findById(chatId);
            if (findAdmin.groupAdmin != req.user.userId) {
                return res.status(401).json({
                    message: 'You are not allowed to do that',
                });
            }
            const removed = await Chat.findByIdAndUpdate(
                chatId,
                {
                    $pull: { users: userId },
                },
                {
                    new: true,
                },
            )
                .populate('users', '-password')
                .populate('groupAdmin', '-password');
            if (!removed) {
                return res.status(404).json({
                    message: 'Chat not found',
                });
            }
            return res.status(200).json(removed);
        } catch (error) {
            return res.status(500).json({
                message: error.message,
            });
        }
    }
    static async removeGroupChat(req, res) {
        const { id } = req.params;
        try {
            const findAdmin = await Chat.findById(id);
            if (findAdmin.groupAdmin != req.user.userId) {
                return res.status(401).json({
                    message: 'You are not allowed to do that',
                });
            }
            const removeGroupChat = await Chat.deleteOne({ _id: id });
            if (removeGroupChat.deletedCount === 0) {
                return res.status(404).json({
                    message: 'Chat not found',
                });
            }
            return res.status(200).json({
                message: 'Chat deleted successfully',
            });
        } catch (error) {
            return res.status(500).json({
                message: error.message,
            });
        }
    }
}

module.exports = ChatController;
