const users  = require('../controllers/users_controller.js');
const valid = require('../middlewares/validator.js')
const express = require('express')
const router = express.Router()

router.get('/', users.getAllUsers);
router.post('/create', valid.createUserValidator, users.createUser)
// router.put('/update-info',  users.updateUser)

module.exports = router;
