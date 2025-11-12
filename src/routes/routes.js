const express = require('express');
const router = express.Router();
const authRoutes = require('./auth_routes.js');
const usersRoutes = require('./users_routes.js');
const foodsRoutes = require('./foods_routes.js');
const addressRoutes = require('./address_routes.js');
const restaurantReviewsRoutes = require('./restaurant_reviews_routes.js');

module.exports = app => {
  app.use('/api', router);
  router.use('/auth', authRoutes);
  router.use('/foods', foodsRoutes);
  router.use('/users', usersRoutes);
  router.use('/address', addressRoutes);
  router.use('/restaurant-reviews', restaurantReviewsRoutes);
};