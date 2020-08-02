const express = require("express");
const userRoutes = require("./user.route");
const authRoutes = require("./auth.route");
const router = express.Router();
const passport = require("passport");

router.route("/").get((req, res) => {
  res.send("OK");
});

router.use("/auth", authRoutes);
router.use(
  "/user",
  passport.authenticate("jwt", { session: false }),
  userRoutes
);

module.exports = router;
