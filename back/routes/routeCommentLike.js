const express = require('express');
const router = express.Router();
const ctrlCommentLike = require('../controllers/ctrlCommentLike');
const auth = require('../middlewares/auth');
const checkCommentLike = require('../middlewares/checkCommentLike');

router.get('/', ctrlCommentLike.getAllCommentLikes);
router.post('/', auth, ctrlCommentLike.createCommentLike);
router.get('/:id', ctrlCommentLike.getOneCommentLike);
router.delete('/:id', auth, checkCommentLike, ctrlCommentLike.deleteCommentLike);

module.exports = router;