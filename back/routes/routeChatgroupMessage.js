const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth'); // Ensure user is authenticated
const checkGroupMember = require('../middlewares/checkGroupMember'); // Ensure user is in the group
const checkChatGroupMessage = require('../middlewares/modelCheckChatgroupMessage'); // Ensure user owns message
const ctrlChatGroupMessage = require('../controllers/ctrlChatgroupMessage');

router.get('/:group_id', auth, checkGroupMember, ctrlChatGroupMessage.getGroupMessages); // Get messages
router.post('/', auth, checkGroupMember, ctrlChatGroupMessage.sendGroupMessage); // Send message
router.delete('/:id', auth, checkChatGroupMessage, ctrlChatGroupMessage.deleteGroupMessage); // Delete message

module.exports = router;
