const express = require('express');
const router = express.Router();
const ctrlComment = require('../controllers/ctrlComment');
const auth = require('../middlewares/auth');
const checkComment = require('../middlewares/checkComment');


router.get('/', ctrlComment.getAllComments);
router.post('/', auth, ctrlComment.createComment);
router.get('/:id', ctrlComment.getOneComment);
router.put('/:id', auth, checkComment, ctrlComment.updatePost);
router.delete('/:id', auth, checkComment, ctrlComment.deletePost);

module.exports = router;

