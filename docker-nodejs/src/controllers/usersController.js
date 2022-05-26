'use strict';

const User = require('../models').User,
      passport = require('passport'),
      { validationResult } = require('express-validator');

module.exports = {
  login: (req, res) => {
    res.render('users/login')
  },

  loginAuthenticate: passport.authenticate('login', {
    failureFlash: true,
    failureRedirect: '/user/login',
    successFlash: true,
    successRedirect: '/user/dashboard'
  }),

  register: (req, res) => {
    res.render('users/register');
  },

  validate: (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      const errorMessages = errors.array().map(error => error.msg);
      req.flash('error', errorMessages);
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
    res.render('users/dashboard');
  },

  logout: (req, res, next) => {
    req.logout();
    req.flash('success', "ログアウトしました。");
    res.redirect('/user/login');
  }
};