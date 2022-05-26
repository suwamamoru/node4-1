'use strict';

const User = require('../models').User,
      passport = require('passport'),
      jsonWebToken = require('jsonwebtoken');

module.exports = {
  jwtAuthenticate: (req, res, next) => {
    passport.authenticate("local", (errors, user) => {
      if (user) {
        const signedToken = jsonWebToken.sign(
          {
            data: user._id,
            exp: new Date().setDate(new Date().getDate() + 1)
          },
          "secret_encoding_passphrase"
        );
        res.json({
          success: true,
          token: signedToken
        });
      } else
        res.json({
          success: false,
          message: "Could not authenticate user."
        });
    })(req, res, next);
  },

  verifyJWT: (req, res, next) => {
    const token = req.headers.token;
    if (token) {
      jsonWebToken.verify(token, "secret_encoding_passphrase", (errors, payload) => {
        if (payload) {
          User.findByPk(payload.data).then(user => {
            if (user) {
              next();
            } else {
              res.status(httpStatus.FORBIDDEN).json({
                error: true,
                message: "No User account found."
              });
            }
          });
        } else {
          res.status(httpStatus.UNAUTHORIZED).json({
            error: true,
            message: "Cannot verify API token."
          });
          next();
        }
      });
    } else {
      res.status(httpStatus.UNAUTHORIZED).json({
        error: true,
        message: "Provide Token"
      });
    }
  }
};