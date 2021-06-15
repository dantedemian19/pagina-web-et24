const passportLocal = require('passport-local').Strategy;
const User = require('./models/user');
const bcrypt = require('bcrypt');

function initializePassport(passport){

  const authenticateUser = async (email, password, done) => {
    const user = await User.findOne({email: email})
    if (!user) {
      return done(null, false, { message: 'email o contraseña incorrectos.' })
    }

    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user)
      } else {
        return done(null, false, { message: 'email o contraseña incorrectos.' })
      }
    } catch (e) {
      return done(e)
    }
  }

  passport.use(new passportLocal({usernameField: 'email'}, authenticateUser));
  passport.serializeUser((user, done) => done(null, user._id))
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  })
}

module.exports = initializePassport;
