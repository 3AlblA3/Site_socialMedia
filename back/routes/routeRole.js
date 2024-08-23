const express = require('express');
const router = express.Router();
const ctrlRole = require('../controllers/ctrlRole');


router.get('/', ctrlRole.getAllRoles);
router.get('/:id', ctrlRole.getOneRole);

module.exports = router;