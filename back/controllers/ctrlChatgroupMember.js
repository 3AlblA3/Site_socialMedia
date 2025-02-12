const ChatGroupMember = require("../models/chatGroupMember");
const ChatGroup = require("../models/chatGroup");
const User = require("../models/modelUser");

// Get all members of a group
exports.getGroupMembers = async (req, res) => {
    try {
        const { group_id } = req.params;

        const members = await ChatGroupMember.findAll({
            where: { group_id },
            include: [{ model: User, attributes: ["id", "nom", "prenom", "email"] }]
        });

        res.status(200).json(members);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Add a member to a group
exports.addMember = async (req, res) => {
    try {
        const { group_id, user_id } = req.body;

        // Check if group exists
        const group = await ChatGroup.findByPk(group_id);
        if (!group) {
            return res.status(404).json({ message: "Group not found!" });
        }

        // Add member
        const newMember = await ChatGroupMember.create({ group_id, user_id });

        res.status(201).json({ message: "Member added to group", data: newMember });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Remove a member from a group
exports.removeMember = async (req, res) => {
    try {
        const { group_id, user_id } = req.body;

        await ChatGroupMember.destroy({ where: { group_id, user_id } });

        res.status(200).json({ message: "Member removed from group" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
