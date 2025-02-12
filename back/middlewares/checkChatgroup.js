const ChatGroup = require('../models/modelChatgroup');

module.exports = async (req, res, next) => {
    try {
        const groupId = req.params.id || req.body.group_id;
        const group = await ChatGroup.findByPk(groupId);

        if (!group) {
            return res.status(404).json({ message: 'Group not found!' });
        }
        
        if (group.created_by !== req.auth.user_id && req.auth.role_id !== 3) {
            return res.status(403).json({ message: 'Forbidden: You are not allowed to manage this group!' });
        }

        req.chatGroup = group; // Pass the group to the controller if needed
        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
