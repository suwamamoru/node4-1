'use strict';

const { check } = require('express-validator');

const registerValidator = (req, res) => {
  return [
    check('username')
      .notEmpty()
      .withMessage('nameを入力してください。'),
    check('email')
      .isEmail()
      .withMessage('有効なemailを入力してください。')
      .normalizeEmail()
      .notEmpty()
      .trim(),
    check('password')
      .isLength({ min: 7 })
      .withMessage('passwordは7文字以上で入力してください。'),
    check('confirmPassword')
      .custom((value, { req }) => {
        if(req.body.password !== req.body.confirmPassword) {
          return false;
        }
        return true;
      })
      .withMessage('passwordと一致させてください。')
  ]
}

module.exports = { registerValidator };