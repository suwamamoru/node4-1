'use strict';


const express = require('express'),
      router = express.Router(),
      usersController = require('../controllers/usersController'),
      { registerValidator } = require('../middleware/validator');

router.get('/login', usersController.login);
router.post('/login', usersController.loginAuthenticate);
router.get('/register', usersController.register);
router.post(
  '/register',
  registerValidator(),
  usersController.validate,
  usersController.registerAuthenticate
);
router.get(
  '/dashboard',
  usersController.isAuthenticated,
  usersController.dashboard,
  usersController.dashboardView
);
router.post('/logout', usersController.logout);

module.exports = router;