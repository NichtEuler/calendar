const express = require("express");

const calendarEventController = require("../controllers/calendarEvent");

const router = express.Router();

router.post("/:roomId", calendarEventController.createCalendarEvent);

//muss vor /:id sein sonst hält ers für ne ID

router.delete("/:id", calendarEventController.deleteCalendarEvent);

router.get("/:roomId", calendarEventController.getCalendarEvents);

router.put("/:id", calendarEventController.updateOne);

module.exports = router;