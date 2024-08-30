const express = require('express');
const router = express.Router();
const ctrlPostLike = require('../controllers/ctrlPostLike');
const auth = require('../middlewares/auth');
const checkPostLike = require('../middlewares/checkPostLike');
;
router.get('/:id', ctrlPostLike.getOnePostLike);
router.delete('/:id', auth, checkPostLike, ctrlPostLike.deletePostLike);

router.get('/', ctrlPostLike.getAllPostLikes);
router.post('/', auth, ctrlPostLike.createPostLike)
module.exports = router;