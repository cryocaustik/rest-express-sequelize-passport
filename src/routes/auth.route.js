const express = require("express");
const passport = require("passport");
const router = express.Router();
const AuthController = require("../controllers/auth.controller");
const roles = require("../middleware/roles");

router.post("/login", AuthController().authenticate);
router.post("/register", AuthController().register);
router.post(
  "/refresh",
  passport.authenticate("jwt", {
    session: false,
  }),
  AuthController().refreshToken
);
router.post(
  "/cpwd",
  passport.authenticate("jwt", {
    session: false,
  }),
  roles(["Superuser", "administrator"]),
  AuthController().updatePassword
);

module.exports = router;
