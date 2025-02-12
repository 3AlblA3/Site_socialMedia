const ChatGroupMember = require('../models/modelChatgroupMember');

module.exports = async (req, res, next) => {
    try {
        const { user_id } = req.auth;
        const groupId = req.params.group_id || req.body.group_id;

        const isMember = await ChatGroupMember.findOne({ where: { group_id: groupId, user_id } });

        if (!isMember) {
            return res.status(403).json({ message: 'Forbidden: You are not a member of this group!' });
        }

        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
