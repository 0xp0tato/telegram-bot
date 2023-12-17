const passport = require("passport");
const TwitterStrategy = require("passport-twitter");
const { storeTwitterData } = require("./DB/storeTwitterData");

require("dotenv").config();

const SetupPassport = () => {
  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (user, done) {
    done(null, user);
  });

  passport.use(
    new TwitterStrategy(
      {
        consumerKey: process.env.TWITTER_API_KEY,
        consumerSecret: process.env.TWITTER_API_KEY_SECRET,
        callbackURL: "http://localhost:3000/auth/twitter/callback",
      },
      async function (token, tokenSecret, profile, cb) {
        cb(null, token, tokenSecret, profile);
      }
    )
  );
};

module.exports = { SetupPassport };
