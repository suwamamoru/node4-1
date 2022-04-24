const passport = require('passport');
const LocalStrategy = require('passport-local');
const jwt = require('passport-jwt');

exports.Passport = (req, res) => {
  passport.authenticate('login', { session: false, failWithError: true }),
  (req, res) => {
    const user = req.user;
    const token = jwt.sign(user, 'secret');
    res.json({ token });
  },
  (err, req, res, next) => {
    if (err || !req.user) {
      res.status(401).send('Unauthorized');
    } else {
      next(err);
    }
  }
}

exports.PassportLocal = () => {
  passport.use('login', new LocalStrategy({
    session: false,
    passReqToCallback: true
  }, async (req, username, password, done) => {
    const user = await auths.findOne({ where: { email } });
    if (username === user.email && password === user.password) {
      const { id, name, email } = user;
      done(null, { id, name, email});
    } else {
      done(null, false, { message: 'ユーザ名またはパスワードが違います。' });
    }
  }));
}

exports.JWT = () => {
  const JwtStrategy = jwt.Strategy;
  const ExtractJwt = jwt.ExtractJwt;
  passport.use('verify', new JwtStrategy({
    secretOrKey: 'secret',
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
  }, (jwtPayload, done) => {
    const user = auth.findById(jwtPayload.id);
    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  }))
}