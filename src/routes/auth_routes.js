const users  = require('../controllers/users_controller.js')
const {createUserValidator, emailValidator, updateUserValidator} = require('../middlewares/validator.js')
const express = require('express')
const router = express.Router()
const { passportAuth, isTokenBlacklisted } = require('../middlewares/authenticate.js')

router.post('/register', createUserValidator, users.createUser)
router.post('/login', users.userLogin)
router.post('/logout', users.userLogout)
router.post('/reset-password', emailValidator, users.resetPassword);
router.put('/update', isTokenBlacklisted, passportAuth, updateUserValidator, users.updateUserInfo);
router.get('/me', isTokenBlacklisted, passportAuth, users.getCurrentUser);

module.exports = router;
