const foods = require('../controllers/foods_controller.js')
const reviews = require('../controllers/food_reviews_controller.js')
const { foodValidator, updateFoodValidator, reviewValidator: foodReviewValidator } = require('../middlewares/validator.js')
const { checkAdminRole, passportAuth, isTokenBlacklisted, optionalLogin } = require('../middlewares/authenticate.js')
const express = require('express')
const router = express.Router()

router.get('/', foods.getFoods)
router.get('/:id', foods.getFoodById)
router.get('/:id/reviews', reviews.getFoodReviews)
router.post('/:id/reviews/add', optionalLogin, foodReviewValidator, reviews.addFoodReview)
router.delete('/:id/delete', passportAuth, isTokenBlacklisted, checkAdminRole, foods.deleteFoodById)
router.post('/add', passportAuth, isTokenBlacklisted, checkAdminRole, foodValidator, foods.addFood)
router.put('/:id/update', passportAuth, isTokenBlacklisted, checkAdminRole, updateFoodValidator, foods.updateFoodById)

module.exports = router;
