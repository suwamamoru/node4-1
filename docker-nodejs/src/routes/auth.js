'use strict';

const express = require('express'),
      router = express.Router(),
      authController = require('../controllers/authController');

router.post('/login', authController.jwtAuthenticate);
router.use(authController.verifyJWT);

module.exports = router;