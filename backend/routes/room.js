const express = require("express");

const roomController = require("../controllers/room");

const router = express.Router();

router.get("/", roomController.getRooms)

router.get("/:id", roomController.getRoom)

router.post("/", roomController.createRoom);

router.put("/", roomController.editRoom);

module.exports = router;