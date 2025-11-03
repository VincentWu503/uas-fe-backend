const express = require('express');
const router = express.Router();
const usersRoutes = require('../routes/user_routes.js')
const foodsRoutes = require('../routes/foods_routes.js')

module.exports = app => {
  app.use('/api', router)
  router.use('/users', usersRoutes)
  router.use('/foods', foodsRoutes);
};