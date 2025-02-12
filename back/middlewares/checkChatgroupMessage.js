const ChatGroupMessage = require('../models/modelChatgroupMessage');

module.exports = async (req, res, next) => {
    try {
        const messageId = req.params.id;  
        const userId = req.auth.user_id;

        const message = await ChatGroupMessage.findByPk(messageId);

        if (!message) {
            return res.status(404).json({ message: 'Message not found!' });
        }

        // Ensure user is the sender of the message
        if (message.sender_id !== userId && req.auth.role_id !== 3) {
            return res.status(403).json({ message: 'Forbidden: You cannot delete this message!' });
        }

        req.chatGroupMessage = message;  // Pass the message to the controller if needed
        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
