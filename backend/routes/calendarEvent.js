const express = require("express");

const checkAuth = require("../middleware/check-auth");
const calendarEventController = require("../controllers/calendarEvent");

const router = express.Router();

router.post("/:roomId", checkAuth, calendarEventController.createCalendarEvent);

//muss vor /:id sein sonst hält ers für ne ID

router.delete("/:id", checkAuth, calendarEventController.deleteCalendarEvent);

router.get("/:roomId", calendarEventController.getCalendarEvents);

router.get("/event/:id", calendarEventController.getCalendarEvent);

router.put("/:id", checkAuth, calendarEventController.updateOne);

module.exports = router;