'use strict';

const express = require('express'),
      router = express.Router(),
      user = require('./user'),
      auth = require('./auth');

router.use('/auth', user);
router.use('/auth', auth);

module.exports = router;