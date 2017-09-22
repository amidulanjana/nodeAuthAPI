const Authenication = require("./controllers/authentication");
const passportService = require("./services/passport");
const passport = require("passport");

const requireAuth = passport.authenticate("jwt", { session: false });
const requireSignin = passport.authenticate("local", { session: false });
const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"]
});

module.exports = function(app) {
  app.get("/", requireAuth, function(req, res) {
    res.send("aasdsada");
  });
  app.post("/signin", requireSignin, Authenication.signin);
  app.post("/signup", Authenication.signup);

  //Google authentication
  app.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );

  app.get(
    "/auth/google/callback",
    passport.authenticate("google", { session: false }),
    Authenication.signin
  );

  //facebook authentication
  app.get(
    "/auth/facebook",
    passport.authenticate("facebook", { scope: ["email"] })
  );

  app.get(
    "/auth/facebook/callback",
    passport.authenticate("facebook", { failureRedirect: "/login" }),
    Authenication.signin
  );
};
