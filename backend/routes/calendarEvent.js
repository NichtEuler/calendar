const express = require("express");

const calendarEventController = require("../controllers/calendarEvent");

const router = express.Router();

router.post("/createcalendarevent", calendarEventController.createCalendarEvent);

router.put("/editcalendarevent", calendarEventController.editCalendarEvent);

module.exports = router;