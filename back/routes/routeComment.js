const express = require('express');
const router = express.Router();
const ctrlComment = require('../controllers/ctrlComment');
const auth = require('../middlewares/auth');
const checkComment = require('../middlewares/checkComment');
const multer = require('../middlewares/multer-config')



router.get('/', ctrlComment.getAllComments);
router.post('/', auth, multer, ctrlComment.createComment);
router.get('/:id', ctrlComment.getOneComment);
router.put('/:id', auth, checkComment, multer, ctrlComment.updateComment);
router.delete('/:id', auth, checkComment, ctrlComment.deleteComment);

module.exports = router;

