const passport = require("passport");
const User = require("../models/user");
const config = require("../config");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const LocalStrategy = require("passport-local");
var GoogleStrategy = require("passport-google-oauth20").Strategy;
var FacebookStrategy = require("passport-facebook").Strategy;

const localOptions = { usernameField: "email" };
const JwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader("authorization"),
  secretOrKey: config.secret
};

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

const localLogin = new LocalStrategy(localOptions, function(
  email,
  password,
  done
) {
  User.findOne({ email: email }, function(err, user) {
    if (err) return done(err);
    if (!user) return done(null, false);
    user.comparePassword(password, function(err, isMatch) {
      if (err) return done(err);
      if (!isMatch) return done(null, false);
      return done(null, user);
    });
  });
});

const JwtLogin = new JwtStrategy(JwtOptions, function(payload, done) {
  User.findById(payload.sub, function(err, user) {
    if (err) return done(err, false);
    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });
});

const GoogleLogin = new GoogleStrategy(
  {
    clientID: config.google.GOOGLE_CLIENT_ID,
    clientSecret: config.google.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOne({ googleID: profile.id }, function(err, existingUser) {
      if (err) return done(err);
      if (existingUser) {
        return done(null, existingUser);
      } else {
        const user = new User({
          email: profile.emails[0].value,
          googleID: profile.id,
          name: profile.displayName,
          profileImg: profile._json.image.url
        });

        user.save((err, user) => {
          if (err) done(err);
          else return done(null, user);
        });
      }
    });
  }
);

const FacebookLogin = new FacebookStrategy(
  {
    clientID: config.facebook.FACEBOOK_APP_ID,
    clientSecret: config.facebook.FACEBOOK_APP_SECRET,
    callbackURL: "/auth/facebook/callback",
    profileFields: ["id", "displayName", "photos", "email"]
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOne({ facebookID: profile.id }, function(err, existingUser) {
      if (err) return done(err);
      if (existingUser) {
        return done(null, existingUser);
      } else {
        const user = new User({
          email: profile.emails[0].value,
          facebookID: profile.id,
          name: profile.displayName,
          profileImg: profile.photos[0].value
        });

        user.save((err, user) => {
          if (err) done(err);
          else return done(null, user);
        });
      }
    });
  }
);

passport.use(JwtLogin);
passport.use(localLogin);
passport.use(GoogleLogin);
passport.use(FacebookLogin);
