const addr = require('../controllers/address_controller.js')
const express = require('express')
const router = express.Router()
const { checkAdminRole, passportAuth, isTokenBlacklisted, optionalLogin } = require('../middlewares/authenticate.js')
const { addAddressValidator, updateAddressValidator } = require('../middlewares/validator.js')

router.get('/', optionalLogin, addr.getAddresses)
router.post('/add', passportAuth, isTokenBlacklisted, checkAdminRole, addAddressValidator, addr.addAddress)
router.put('/:id/update', passportAuth, isTokenBlacklisted, checkAdminRole, updateAddressValidator, addr.updateAddressById)
router.delete('/:id/delete', passportAuth, isTokenBlacklisted, checkAdminRole, addr.deleteAddressById)

module.exports = router;