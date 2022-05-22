'use strict';

const User = require('../models').User,
      passport = require('passport'),
      jsonWebToken = require('jsonwebtoken'),
      { validationResult } = require('express-validator');

module.exports = {
  login: (req, res) => {
    res.render('login')
  },

  loginAuthenticate: passport.authenticate('login', {
    failureFlash: true,
    failureRedirect: '/user/login',
    successFlash: true,
    successRedirect: '/user/dashboard'
  }),

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
  },

  register: (req, res) => {
    res.render('register');
  },

  validate: (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      const errorMessages = errors.array().map(error => error.msg);
      req.flash('error', errorMessages.join("また、"));
      res.redirect('/user/register');
    } else {
      next();
    }
  },

  registerAuthenticate: passport.authenticate('register', {
    failureFlash: true,
    failureRedirect: '/user/register',
    successFlash: true,
    successRedirect: '/user/dashboard'
  }),

  isAuthenticated: (req, res, next) => {
    if(req.isAuthenticated()) {
      next();
    } else {
      req.flash('error', "ログインしてください。");
      res.redirect('/user/login');
    }
  },

  dashboard: (req, res, next) => {
    User.findAll()
      .then(users => {
        res.locals.users = users;
        next();
      })
      .catch(error => {
        console.log(`Error fetching users: ${error.message}`);
        next(error);
      });
  },

  dashboardView: (req, res) => {
    res.render('dashboard');
  },

  logout: (req, res, next) => {
    req.logout();
    req.flash('success', "ログアウトしました。");
    res.redirect('/user/login');
  }
};