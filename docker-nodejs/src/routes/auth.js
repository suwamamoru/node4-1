const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/login', authController.getLoginPage);
router.get('/register', authController.getRegisterPage);
router.post('/dashboard', authController.login);

module.exports = router;
