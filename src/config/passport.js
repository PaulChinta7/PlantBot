const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const bcrypt = require('bcrypt');
const { getDB } = require('../../db');

// -----------------------------
// 1. LOCAL STRATEGY (LOGIN)
// -----------------------------
passport.use(
  new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
      try {
        const db = getDB();

        const user = await db.collection('Users').findOne({ email });

        if (!user) {
          return done(null, false, { message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
          return done(null, false, { message: 'Wrong password' });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// -----------------------------
// 2. JWT STRATEGY (PROTECTED ROUTES)
// -----------------------------
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET_KEY,
    },
    async (payload, done) => {
      try {
        const db = getDB();

        const user = await db.collection('Users').findOne({
          email: payload.email,
        });
        console.log(payload.email);

        if (!user) return done(null, false);

        return done(null, user);
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

module.exports = passport;