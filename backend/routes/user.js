const express = require("express");

const userController = require("../controllers/user");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.post("/signup", userController.createUser);

router.post("/editUser",checkAuth, userController.editUser)

router.post("/login", userController.userLogin);

router.get("/:creatorId", userController.findUserName);

module.exports = router;