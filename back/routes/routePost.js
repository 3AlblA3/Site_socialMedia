const express = require('express');
const router = express.Router();
const ctrlPost = require('../controllers/ctrlPost');
const auth = require('../middlewares/auth');
const checkPost = require('../middlewares/checkPost');

router.get('/', ctrlPost.getAllPosts);
router.post('/', auth, ctrlPost.createPost);
router.get('/:id', ctrlPost.getOnePost);
router.put('/:id', auth, checkPost, ctrlPost.updatePost);
router.delete('/:id', auth, checkPost, ctrlPost.deletePost);

module.exports = router;