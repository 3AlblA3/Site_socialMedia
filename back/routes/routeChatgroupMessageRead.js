const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth'); // Ensure user is authenticated
const checkGroupMember = require('../middlewares/checkGroupMember'); // Ensure user is in the group
const checkChatGroupMessageRead = require('../middlewares/checkChatgroupMessageRead'); // Ensure user can access read receipts
const ctrlChatGroupMessageRead = require('../controllers/ctrlChatgroupMessageRead');

router.get('/:message_id', auth, checkGroupMember, checkChatGroupMessageRead, ctrlChatGroupMessageRead.getReaders); // Get read receipts
router.put('/:message_id/read', auth, checkGroupMember, ctrlChatGroupMessageRead, ctrlChatGroupMessageRead.markAsRead); // Mark as read

module.exports = router;
