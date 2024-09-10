const express = require('express');
const router = express.Router();
const ctrlPost = require('../controllers/ctrlPost');
const auth = require('../middlewares/auth');
const checkPost = require('../middlewares/checkPost');
const multer = require('../middlewares/multer-config')

router.get('/', ctrlPost.getAllPosts);
router.post('/', auth, multer, ctrlPost.createPost);
router.get('/:id', ctrlPost.getOnePost);
router.put('/:id', auth, checkPost, multer, ctrlPost.updatePost);
router.delete('/:id', auth, checkPost, ctrlPost.deletePost);

module.exports = router;

