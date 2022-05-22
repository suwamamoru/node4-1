'use strict';

const express = require('express'),
      router = express.Router(),
      usersController = require('../controllers/usersController');

router.post('/login', usersController.jwtAuthenticate);
router.use(usersController.verifyJWT);

module.exports = router;