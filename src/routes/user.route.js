const express = require("express");
const UserController = require("../controllers/user.controller");
const router = express.Router();

router.route("/").get(UserController().getMe);
router.route("/all").get(UserController().getAll);
router.get("/roles", UserController().getRoles);
router.get("/userroles", UserController().getUserRoles);

module.exports = router;
