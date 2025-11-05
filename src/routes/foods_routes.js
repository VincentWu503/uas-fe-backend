const foods = require('../controllers/foods_controller.js')
const {foodValidator, updateFoodValidator} = require('../middlewares/validator.js')
const express = require('express')
const router = express.Router()

router.get('/', foods.getFoods)
router.get('/:id', foods.getFoodById)
router.delete('/:id/delete', foods.deleteFoodById)
router.post('/add', foodValidator, foods.addFood)
router.put('/:id/update', updateFoodValidator, foods.updateFoodById)

module.exports = router;
