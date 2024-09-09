const passport = require("passport");

const LocalStrategy = require("passport-local").Strategy;

const User = require("../models/employeeSchema");

// authentication using passport
passport.use(
  new LocalStrategy(
    { usernameField: "email", passReqToCallback: true },
    async function (req, email, password, done) {
      const user = await User.findOne({ email });
      if (!user) {
        console.log("Error in finding user ");
        return err;
      }
      if (!user || user.password !== password) {
        console.log("Invalid username and password");
        return done(null, false);
      }
      return done(null, user); //1)if user found then return the user to the serialized
    }
  )
);

// serialize user
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

// deserialize user
// deserialize user
passport.deserializeUser(async function (id, done) {
  const user = await User.findById(id);
  if (!user) {
    console.log("Error in finding user ");
    return done(err);
  } else {
    return done(null, user);
  }
});

// check if user is authenticated
passport.checkAuthentication = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect("/employee/signin");
};

// check for admin
passport.checkAdmin = function (req, res, next) {
  if (!req.user.isAdmin) {
    console.log(`Employees are not allowed to access this resource`);
    return res.redirect("back");
  }
  return next();
};

// set authenticated user for views
passport.setAuthenticatedUser = function (req, res, next) {
  if (req.isAuthenticated()) {
    res.locals.user = req.user;
  }
  next();
};
