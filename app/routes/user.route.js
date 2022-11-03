const express = require("express");
const users = require("../controllers/user.controller");

const router = express.Router();

router.route("/signup").post(users.signup);
router.route("/login").post(users.login);
router.get("/logout", users.logout);

module.exports = router;
