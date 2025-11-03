const foods  = require('../controllers/foods_controller.js');
const valid = require('../middlewares/validator.js')
const express = require('express')
const router = express.Router()

router.get('/', foods.getFoods);
router.post('/add', foods.addFood)

module.exports = router;
