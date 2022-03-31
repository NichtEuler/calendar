const express = require("express");

const calendarEventController = require("../controllers/calendarEvent");

const router = express.Router();

router.post("", calendarEventController.createCalendarEvent);

//router.put("/:id", calendarEventController.updateOne);

module.exports = router;