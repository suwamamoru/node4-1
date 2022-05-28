'use strict';

const passport = require('passport'),
      LocalStrategy = require('passport-local'),
      User = require('../models').User;

module.exports = app => {
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
};