const express = require("express");
const router = express.Router();
const { Register, login, home } = require("../controller/viewController");
const {} = require("../controller/autheController");

router.get("/", home);
router.get("/login", login);
router.get("/Register", Register);

module.exports = router;
