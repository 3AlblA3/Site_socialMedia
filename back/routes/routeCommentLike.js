const express = require('express');
const router = express.Router();
const ctrlCommentLike = require('../controllers/ctrlCommentLike');
const auth = require('../middlewares/auth');


router.get('/', ctrlCommentLike.getAllCommentLikes);
router.post('/', auth, ctrlCommentLike.createCommentLike);
router.get('/:id', ctrlCommentLike.getOneCommentLike);
router.delete('/:id', auth, ctrlCommentLike.deleteCommentLike);

module.exports = router;