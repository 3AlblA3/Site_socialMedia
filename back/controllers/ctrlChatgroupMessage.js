const ChatGroupMessage = require("../models/chatGroupMessage");
const ChatGroupMessageRead = require("../models/chatGroupMessageRead");

// Get all messages in a group
exports.getGroupMessages = async (req, res) => {
    try {
        const { id } = req.params;

        const messages = await ChatGroupMessage.findAll({
            where: { group_id: id },
            order: [['sent_at', 'ASC']]
        });

        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Send a message to a group
exports.sendGroupMessage = async (req, res) => {
    try {
        const { userId } = req.auth;
        const { group_id, content } = req.body;

        const message = await ChatGroupMessage.create({
            group_id,
            sender_id: userId,
            content
        });

        res.status(201).json({ message: "Message sent", data: message });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Mark a group message as read
exports.markGroupMessageAsRead = async (req, res) => {
    try {
        const { userId } = req.auth;
        const { message_id } = req.params;

        await ChatGroupMessageRead.create({
            message_id,
            user_id: userId,
            read_at: new Date()
        });

        res.status(200).json({ message: "Message marked as read" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a message from a group
exports.deleteGroupMessage = async (req, res) => {
    try {
        const { id } = req.params;

        await ChatGroupMessage.destroy({ where: { id } });

        res.status(200).json({ message: "Message deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
