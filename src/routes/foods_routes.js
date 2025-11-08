const foods = require('../controllers/foods_controller.js')
const { foodValidator, updateFoodValidator } = require('../middlewares/validator.js')
const { checkAdminRole, passportAuth } = require('../middlewares/authenticate.js')
const express = require('express')
const router = express.Router()

router.get('/', passportAuth, foods.getFoods)
router.get('/:id', passportAuth, foods.getFoodById)
router.delete('/:id/delete', passportAuth, checkAdminRole, foods.deleteFoodById)
router.post('/add', passportAuth, checkAdminRole, foodValidator, foods.addFood)
router.put('/:id/update', passportAuth, checkAdminRole, updateFoodValidator, foods.updateFoodById)

module.exports = router;
