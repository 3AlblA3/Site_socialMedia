const express = require('express');
const router = express.Router();
const ctrlUser = require('../controllers/ctrlUser');
const auth = require('../middlewares/auth');
const checkUser= require('../middlewares/checkUser')

router.get('/', ctrlUser.getAllUsers);
router.post('/login', ctrlUser.login);
router.post('/signup', ctrlUser.signup);
router.get('/:id', ctrlUser.getOneUser);
router.put('/:id', auth, checkUser, ctrlUser.updateUser);
router.delete('/:id', auth, checkUser, ctrlUser.deleteUser);

module.exports = router;
