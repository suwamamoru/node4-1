'use strict';

const express = require('express'),
      router = express.Router(),
      user = require('./user'),
      jwt = require('./jwt');

router.use('/user', user);
router.use('/jwt', jwt);

module.exports = router;