'use strict';
const express = require('express'),
      app = express(),
      router = require('./routes/index'),
      createError = require('http-errors'),
      path = require('path'),
      logger = require('morgan'),
      layouts = require('express-ejs-layouts'),
      passport = require('passport'),
      LocalStrategy = require('passport-local'),
      connectFlash = require('connect-flash'),
      cookieParser = require('cookie-parser'),
      expressSession = require('express-session'),
      User = require('./models').User;

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

// ユーザ情報をセッションに保存
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// IDからユーザ情報を特定しreq.userに格納
passport.deserializeUser(async(id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch(error) {
    done(error, null);
  }
});

// ストラテジー(認証処理)の設定
passport.use('login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  async(username, password, done) => {
    try {
      const user = await User.findOne({ where: { email: username } });
      if(!user) {
        return done(null, false, "ユーザが存在しません。");
      } else if(user.password !== password) {
        return done(null, false, "パスワードが異なります。");
      } else {
        return done(null, user, "ログインに成功しました。"); 
      }
    } catch(error) {
      return done(error, null);
    }
  }
));

passport.use('register', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
},
async(req, username, password, done) => {
  try {
    const user = await User.findOne({ where: { email: username } });
    if(user) {
      return done(null, false, "このメールアドレスのユーザは既に登録されています。");
    } else {
      User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
      })
        .then(async() => {
          const newUser = await User.findOne({ where: { email: username } });
          return done(null, newUser, "ユーザ登録に成功しました。"); 
        })
        .catch(error => {
          return done(null, false, "登録エラー"); 
        });
    }
  } catch(error) {
    return done(error, null);
  }
}
));

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
