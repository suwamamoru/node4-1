'use strict';

const User = require('../models').User,
      passport = require('passport'),
      { validationResult } = require('express-validator');

module.exports = {
  login: (req, res) => {
    res.render('auth/login')
  },

  loginAuthenticate: passport.authenticate('login', {
    failureFlash: true,
    failureRedirect: '/auth/login',
    successFlash: true,
    successRedirect: '/auth/dashboard'
  }),

  register: (req, res) => {
    res.render('auth/register');
  },

  validate: (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      const errorMessages = errors.array().map(error => error.msg);
      req.flash('error', errorMessages);
      res.redirect('/auth/register');
    } else {
      next();
    }
  },

  registerAuthenticate: passport.authenticate('register', {
    failureFlash: true,
    failureRedirect: '/auth/register',
    successFlash: true,
    successRedirect: '/auth/dashboard'
  }),

  isAuthenticated: (req, res, next) => {
    if(req.isAuthenticated()) {
      next();
    } else {
      req.flash('error', "ログインしてください。");
      res.redirect('/auth/login');
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
    res.render('auth/dashboard');
  },

  logout: (req, res, next) => {
    req.logout();
    req.flash('success', "ログアウトしました。");
    res.redirect('/auth/login');
  }
};