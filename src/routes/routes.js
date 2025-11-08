const express = require('express');
const router = express.Router();
const authRoutes = require('./auth_routes.js')
const usersRoutes = require('./users_routes.js')
const foodsRoutes = require('./foods_routes.js');
const commentsRoutes = require('./food_comments_routes.js')

module.exports = app => {
  app.use('/api', router);
  router.use('/auth', authRoutes);
  router.use('/foods', foodsRoutes);
  router.use('/users', usersRoutes);
};