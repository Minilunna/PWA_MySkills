const express = require("express");
const router = express.Router();

//validations
const { checkDuplicateUsernameOrEmail, checkRolesExisted } = require("../middleware/verifySignUp");
const { verifyToken } = require("../middleware");

//controller
const { signup, signin, signout, changePassword } = require("../controllers/auth.controller");

//routes
router.post("/signup",[checkDuplicateUsernameOrEmail, checkRolesExisted], signup);
router.post("/signin",signin);
router.post("/signout",signout);
router.post("/changePassword", [verifyToken], changePassword);

module.exports = router;