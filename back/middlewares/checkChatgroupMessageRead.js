const ChatGroupMessageRead = require('../models/modelChatgroupMessageRead');
const ChatGroupMember = require('../models/modelChatgroupMember');

module.exports = async (req, res, next) => {
    try {
        const messageId = req.params.message_id;
        const userId = req.auth.user_id;

        // Check if the message exists
        const readReceipt = await ChatGroupMessageRead.findByPk(messageId);
        if (!readReceipt) {
            return res.status(404).json({ message: 'Message read status not found!' });
        }

        // Check if the user is a member of the group
        const isMember = await ChatGroupMember.findOne({ 
            where: { group_id: readReceipt.message_id, user_id: userId } 
        });

        if (!isMember) {
            return res.status(403).json({ message: 'Forbidden: You cannot view read receipts for this message!' });
        }

        req.chatGroupMessageRead = readReceipt; // Pass the read receipt data
        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
