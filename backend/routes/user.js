const express = require("express");

const userController = require("../controllers/user");

const router = express.Router();

router.post("/signup", userController.createUser);

router.post("/login", userController.userLogin);

router.get("/:creatorId", userController.userName)

module.exports = router;