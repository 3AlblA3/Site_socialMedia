const express = require('express');
const router = express.Router();
const ctrlCommentLike = require('../controllers/ctrlCommentLike');
const auth = require('../middlewares/auth');
const checkCommentLike = require('../middlewares/checkCommentLike');

router.get('/', ctrlCommentLike.getAllCommentLikes);
router.post('/', auth, ctrlCommentLike.toggleCommentLike);
router.get('/:id', ctrlCommentLike.getOneCommentLike);

module.exports = router;