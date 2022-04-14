const CalendarEvent = require("../models/calendarEvent");


exports.createCalendarEvent = (req, res, next) => {
    console.log(req.body);
    const calendarEvent = new CalendarEvent({
        title: req.body.title,
        start: req.body.start,
        end: req.body.end,
        allDay: req.body.allDay,
        roomId: req.params.roomId,
        creator: req.body.userId
    });

    calendarEvent.save().then(createdCalendarEvent => {
        res.status(201).json({
            message: "Event sucessfully added!",
            calendarEvent: {
                id: createdCalendarEvent._id,
                ...createdCalendarEvent
            }
        });
    }).catch(error => {
        console.log(error);
        res.status(500).json({
            message: "Event creation failed!"
        })
    });

};

//holt alle Events
exports.getCalendarEvents = (req, res, next) => {
    CalendarEvent.find({ 'roomId': req.params.roomId }).then(calendarEvents => {
        if (calendarEvents) {
            res.status(200).json({ message: "Events fetched successfully", calendarEvents: calendarEvents });
        } else {
            res.status(404).json({ message: "No Events found!" });
        }
    })
        .catch(error => {
            res.status(500).json(
                { message: "Could not fetch events!" }
            )
        });
};

exports.getCalendarEvent = (req, res, next) => {
    CalendarEvent.findById(req.params.id).then(calendarEvent => {
        if (calendarEvent) {
            res.status(200).json(calendarEvent);
        } else {
            res.status(404).json({ message: "Event not found!" });
        }
    })
        .catch(error => {
            res.status(500).json(
                { message: "Fetching event failed!" }
            )
        });
};

exports.deleteCalendarEvent = (req, res, next) => {
    CalendarEvent.deleteOne({ _id: req.params.id, creator: req.params.userId }).then(result => {
        console.log(result);
        if (result.deletedCount > 0) {
            res.status(200).json({ message: "Event sucessfully deleted!" });
        }
        else {
            res.status(401).json({ message: "Not Authorized" });
        }
    }).catch(error => {
        res.status(500).json(
            { message: "Couldn't delete event" }
        )
    });
};

exports.updateOne = (req, res, next) => {
    const calendarEvent = new CalendarEvent({
        _id: req.params.id,
        title: req.body.title,
        start: req.body.start,
        end: req.body.end,
        allDay: req.body.allDay,
        creator: req.body.creator
    });
    CalendarEvent.updateOne({ _id: req.params.id, creator: req.userData.userId }, calendarEvent).then(result => {
        if (result.matchedCount > 0) {
            res.status(200).json({ message: "Event sucessfully edited!" });
        }
        else {
            res.status(401).json({ message: "Not Authorized!" });
        }
    })
        .catch(error => {
            res.status(500).json(
                { message: "Editing event failed!" }
            )
        });
};