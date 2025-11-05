const express = require('express');
const router = express.Router();
const usersRoutes = require('./users_routes.js')
const foodsRoutes = require('../routes/foods_routes.js');
const commentsRoutes = require('../routes/food_comments_routes.js')

module.exports = app => {
  app.use('/api', router)
  router.use('/auth', usersRoutes)
  router.use('/foods', foodsRoutes);
  // router.use('/foods/:foodId', commentsRoutes);
};