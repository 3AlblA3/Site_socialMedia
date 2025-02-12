const ChatGroupMessageRead = require("../models/chatGroupMessageRead");

// Get all users who read a specific message
exports.getReaders = async (req, res) => {
    try {
        const { message_id } = req.params;

        const readers = await ChatGroupMessageRead.findAll({
            where: { message_id },
            attributes: ["user_id", "read_at"]
        });

        res.status(200).json(readers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Mark a message as read
exports.markAsRead = async (req, res) => {
    try {
        const { userId } = req.auth;
        const { message_id } = req.params;

        const alreadyRead = await ChatGroupMessageRead.findOne({ where: { message_id, user_id: userId } });

        if (!alreadyRead) {
            await ChatGroupMessageRead.create({ message_id, user_id: userId, read_at: new Date() });
        }

        res.status(200).json({ message: "Message marked as read" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
