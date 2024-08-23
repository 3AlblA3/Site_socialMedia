const express = require('express');
const router = express.Router();
const ctrlPost = require('../controllers/ctrlPost');
const auth = require('../middlewares/auth');


router.get('/', ctrlPost.getAllPosts);
router.post('/', auth, ctrlPost.createPost);
router.get('/:id', ctrlPost.getOnePost);
router.put('/:id', auth, ctrlPost.updatePost);
router.delete('/:id', auth, ctrlPost.deletePost);

module.exports = router;