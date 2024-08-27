const express = require('express');
const router = express.Router();
const ctrlComment = require('../controllers/ctrlComment');
const auth = require('../middlewares/auth');


router.get('/', ctrlComment.getAllComments);
router.post('/', auth, ctrlComment.createComment);
router.get('/:id', ctrlComment.getOneComment);
router.put('/:id', auth, ctrlComment.updatePost);
router.delete('/:id', auth, ctrlComment.deletePost);

module.exports = router;