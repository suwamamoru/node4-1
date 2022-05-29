'use strict';

const express = require('express'),
      app = express(),
      router = require('./routes/index'),
      createError = require('http-errors'),
      path = require('path'),
      logger = require('morgan'),
      layouts = require('express-ejs-layouts'),
      passport = require('passport'),
      connectFlash = require('connect-flash'),
      cookieParser = require('cookie-parser'),
      expressSession = require('express-session');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(layouts);
app.use(connectFlash());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('secretKey'));
app.use(
  expressSession({
    secret: 'secretKey',
    cookie: {
      maxAge: 24 * 60 * 60 * 1000
    },
    resave: false,
    saveUninitialized: false
  })
);
app.use(express.static(path.join(__dirname, 'public')));

// passportを初期化
app.use(passport.initialize());

// passportをセッションで使用
app.use(passport.session());

// passportの設定を使用
require('./middleware/passport')(app);

// ログアウト後、ページが再読み込みされキャッシュされない。
// その結果、戻るボタンを押してもダッシュボードに戻らない。
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next();
});

app.use((req, res, next) => {
  res.locals.loggedIn = req.isAuthenticated();
  res.locals.currentUser = req.user;
  res.locals.flashMessages = req.flash();
  next();
});

app.use('/', router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
