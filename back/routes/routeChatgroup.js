const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth'); // Ensure user is authenticated
const checkGroupAuth = require('../middlewares/checkChatgroup'); // Ensure user is the group creator
const ctrlChatGroup = require('../controllers/ctrlChatgroup');

router.get('/', auth, ctrlChatGroup.getUserGroups); // Get all groups for a user
router.post('/', auth, ctrlChatGroup.createGroup); // Create a new group
router.delete('/:id', auth, checkGroupAuth, ctrlChatGroup.deleteGroup); // Delete a group

module.exports = router;
