const ChatGroup = require("../models/chatGroup");
const ChatGroupMember = require("../models/chatGroupMember");

// Get all groups a user belongs to
exports.getUserGroups = async (req, res) => {
    try {
        const { userId } = req.auth;

        const groups = await ChatGroup.findAll({
            include: [{ model: ChatGroupMember, where: { user_id: userId } }]
        });

        res.status(200).json(groups);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create a new group
exports.createGroup = async (req, res) => {
    try {
        const { userId } = req.auth;
        const { name, members } = req.body; // members = [user_id1, user_id2, ...]

        const group = await ChatGroup.create({ name, created_by: userId });

        await Promise.all(members.map(user_id => ChatGroupMember.create({
            group_id: group.id,
            user_id
        })));

        res.status(201).json({ message: "Group created", group });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a group
exports.deleteGroup = async (req, res) => {
    try {
        const { id } = req.params;

        await ChatGroup.destroy({ where: { id } });

        res.status(200).json({ message: "Group deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
