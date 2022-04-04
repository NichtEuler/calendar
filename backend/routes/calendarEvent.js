const express = require("express");

const calendarEventController = require("../controllers/calendarEvent");

const router = express.Router();

router.post("", calendarEventController.createCalendarEvent);

//muss vor /:id sein sonst hält ers für ne ID
router.get("/allEvents", calendarEventController.getCalendarEvents);

router.get("/:id", calendarEventController.getCalendarEvent);

router.delete("/:id", calendarEventController.deleteCalendarEvent);

router.get("", calendarEventController.getCalendarEvents);
//router.put("/:id", calendarEventController.updateOne);

module.exports = router;