var User = require('../model/user');
var Role = require('./role');
var bcrypt = require('bcrypt');
var LocalStrategy = require('passport-local').Strategy;

function createHash(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
}

function isValidPassword(user, password) {
  return bcrypt.compareSync(password, user.password);
}

exports.Role = Role;

exports.authenticate = (allowedRoles) => {
  return function (req, res, next) {
    if (req.isAuthenticated()) {
      var role = req.user.role;
      if (allowedRoles.indexOf(role) != -1) {
        next();
      } else {
        res.status(403).send('Go away!');
      }
    } else {
      res.redirect('/login');
    }
  };
}

exports.initPassport = (passport) => {

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });

passport.use('login', new LocalStrategy({
  passReqToCallback: true
}, (req, username, password, done) => {
  User.findOne({ 'username': username }, (err, user) => {
      if (err) {
        console.log(err);
        return done(err);
      }
      if (!user) {
        return done(null, false, req.flash('message', 'Invalid username or password.'));
      }
      if (!isValidPassword(user, password)) {
        return done(null, false, req.flash('message', 'Invalid username or password.'));
      }

      return done(null, user);
    }
  );
}));


passport.use('signup', new LocalStrategy({
  passReqToCallback: true
}, (req, username, password, done) => {
    process.nextTick(() => {
      User.findOne({ 'username': username }, (err, user) => {
        if (err) {
          console.log(err);
          return done(err);
        }
        if (user) {
          console.log('user exists already');
          return done(null, false, req.flash('message', 'User Already Exists'));
        } else {
          var newUser = new User();
          newUser.username = username;
          newUser.password = createHash(password);
          newUser.role = Role.USER;
          newUser.save(function (err) {
            if (err) {
              console.log(err);
              throw err;
            }
            console.log('User created');
            return done(null, newUser);
          });
        }
      });
    });
  }));
};