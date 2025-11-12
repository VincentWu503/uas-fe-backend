const reviews = require('../controllers/restaurant_reviews_controller.js')
const express = require('express');
const { optionalLogin } = require('../middlewares/authenticate.js');
const { restaurantReviewsEnumValidator, reviewValidator } = require('../middlewares/validator.js');
const router = express.Router()

router.get('/', reviews.getRestaurantReviews);
router.post('/add', optionalLogin, reviewValidator, restaurantReviewsEnumValidator, reviews.addRestaurantReview);

module.exports = router;