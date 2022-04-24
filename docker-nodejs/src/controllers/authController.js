const Passport = require('../middleware/passport');

exports.getLoginPage = (req, res) => {
  res.render('login');
};

exports.getRegisterPage = (req, res) => {
  res.render('register');
};

exports.login = (req, res) => {
  Passport;
  res.render('dashboard');
}