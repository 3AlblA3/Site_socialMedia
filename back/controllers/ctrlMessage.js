const Message = require("../models/message");
const { Op } = require("sequelize");


// Get all messages between two users
exports.getMessages = async (req, res) => {
    try {
        const { userId } = req.auth;
        const { receiverId } = req.params;

        const messages = await Message.findAll({
            where: {
                [Op.or]: [ //Fetches messages The sender_id is userId AND the receiver_id is receiverId
                    // OR the sender_id is receiverId AND the receiver_id is userId
                    { sender_id: userId, receiver_id: receiverId },
                    { sender_id: receiverId, receiver_id: userId }
                ]
            },
            order: [['sent_at', 'ASC']]
        });

        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Send a new message
exports.sendMessage = async (req, res) => {
    try {
        const { userId } = req.auth;
        const { receiver_id, content } = req.body;

        const message = await Message.create({
            sender_id: userId,
            receiver_id,
            content
        });

        res.status(201).json({ message: "Message sent", data: message });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Mark message as read
exports.markAsRead = async (req, res) => {
    try {
        const { id } = req.params;

        await Message.update({ read_at: new Date() }, { where: { id } });

        res.status(200).json({ message: "Message marked as read" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a message
exports.deleteMessage = async (req, res) => {
    try {
        const { id } = req.params;

        await Message.destroy({ where: { id } });

        res.status(200).json({ message: "Message deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
