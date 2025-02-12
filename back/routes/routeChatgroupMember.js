const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth'); // Ensure user is authenticated
const checkGroupAuth = require('../middlewares/checkChatgroup'); // Ensure user is the group creator
const ctrlChatGroupMember = require('../controllers/ctrlChatgroupMember');

router.get('/:group_id', auth, ctrlChatGroupMember.getGroupMembers); // Get all members of a group
router.post('/', auth, checkGroupAuth, ctrlChatGroupMember.addMember); // Add a new member
router.delete('/', auth, checkGroupAuth, ctrlChatGroupMember.removeMember); // Remove a member

module.exports = router;
