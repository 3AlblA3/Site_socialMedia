const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth'); // Ensure user is authenticated
const ctrlMessage = require('../controllers/ctrlMessage');

router.get('/:receiverId', auth, ctrlMessage.getMessages); // Get private messages
router.post('/', auth, ctrlMessage.sendMessage); // Send a new message
router.put('/:id/read', auth, ctrlMessage.markAsRead); // Mark message as read
router.delete('/:id', auth, ctrlMessage.deleteMessage); // Delete a message

module.exports = router;
