const users  = require('../controllers/users_controller.js')
const express = require('express')
const router = express.Router()
const { passportAuth, checkAdminRole, isTokenBlacklisted } = require('../middlewares/authenticate.js')

router.get('/', passportAuth, isTokenBlacklisted, checkAdminRole, users.getAllUsers);

module.exports = router;