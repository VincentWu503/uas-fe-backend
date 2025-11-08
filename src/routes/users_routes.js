const users  = require('../controllers/users_controller.js')
const express = require('express')
const router = express.Router()
const { passportAuth, checkAdminRole } = require('../middlewares/authenticate.js')

router.get('/', passportAuth, checkAdminRole, users.getAllUsers);

module.exports = router;