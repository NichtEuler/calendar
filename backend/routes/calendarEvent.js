const express = require("express");

const calendarEventController = require("../controllers/calendarEvent");

const router = express.Router();

router.post("/:room", calendarEventController.createCalendarEvent);

//muss vor /:id sein sonst hält ers für ne ID

router.delete("/:id", calendarEventController.deleteCalendarEvent);

router.get("/:room", calendarEventController.getCalendarEvents);

router.put("/:id", calendarEventController.updateOne);

module.exports = router;