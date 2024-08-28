const express = require('express');
const router = express.Router();
const ctrlPost = require('../controllers/ctrlPost');
const auth = require('../middlewares/auth');
const checkPostOwner = require('../middlewares/checkPostOwner');


router.get('/', ctrlPost.getAllPosts);
router.post('/', auth, ctrlPost.createPost);
router.get('/:id', ctrlPost.getOnePost);
router.put('/:id', auth, checkPostOwner, ctrlPost.updatePost);
router.delete('/:id', auth, checkPostOwner, ctrlPost.deletePost);

module.exports = router;