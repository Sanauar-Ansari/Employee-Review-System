const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const db = require("./config/mogoose");
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("./config/passport");
const port = 8000;

const app = express();

//set ejs template engine
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("./assets"));
app.use(expressLayouts);

app.use(
  session({
    secret: "anything",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
  })
);

// for style and script
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);
app.use(express.urlencoded({ extended: true }));
// passport authentication
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
//Rpoutes
app.use("/", require("./routes"));
// listen to port
app.listen(port, function (error) {
  if (error) {
    console.log("Error while listening the port" + error);
    return;
  }
  console.log("Successfully running on port no:" + port);
});
