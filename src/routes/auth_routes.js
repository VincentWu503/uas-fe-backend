const users  = require('../controllers/users_controller.js')
const {createUserValidator} = require('../middlewares/validator.js')
const express = require('express')
const router = express.Router()

router.post('/register', createUserValidator, users.createUser)
router.post('/login', users.userLogin)
router.post('/logout', users.userLogout)

module.exports = router;
