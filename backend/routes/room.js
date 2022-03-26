const express = require("express");

const roomController = require("../controllers/room");

const router = express.Router();

router.post("/createroom", roomController.createRoom);

router.put("/editroom", roomController.editRoom);

module.exports = router;