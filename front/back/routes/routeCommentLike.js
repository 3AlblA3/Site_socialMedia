const express = require('express');
const router = express.Router();
const ctrlCommentLike = require('../controllers/ctrlCommentLike');
const auth = require('../middlewares/auth');

router.get('/', ctrlCommentLike.getAllCommentLikes);
router.get('/:id', ctrlCommentLike.getOneCommentLike);
router.post('/toggle', auth, ctrlCommentLike.toggleCommentLike);


module.exports = router;