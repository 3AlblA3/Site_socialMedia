const express = require('express');
const router = express.Router();
const ctrlUser = require('../controllers/ctrlUser');
const auth = require('../middlewares/auth');


router.get('/', ctrlUser.getAllUsers);
router.post('/login', ctrlUser.login);
router.post('/signup', ctrlUser.signup);
router.get('/:id', ctrlUser.getOneUser);
router.put('/:id', auth, ctrlUser.updateUser);
router.delete('/:id', auth, ctrlUser.deleteUser);

module.exports = router;
