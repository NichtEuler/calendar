const CalendarEventModel = require("../models/calendarEvent");


exports.createCalendarEvent = (req, res, next) => {
    const calendarEvent = new CalendarEventModel({
        title: req.body.title,
        start: req.body.start,
        end: req.body.end
    });
    calendarEvent.save().then(createdCalendarEvent => {
        res.status(201).json({
            message: "Event sucessfully added",
            calendarEventModel: {
                id: createdCalendarEvent._id,
                ...createdCalendarEvent
            }
        });
    }).catch(error => {
        res.status(500).json({
            message: "Event creation failed"
        })
    });

};

//holt alle Events
exports.getCalendarEvents = (req, res, next) => {
    CalendarEventModel.find().then(calendarEvents => {
        if (calendarEvents) {
            res.status(200).json({ message: "Events fetched successfully", calendarEvents: calendarEvents });
        } else {
            res.status(404).json({ message: "No Events found!" });
        }
    })
        .catch(error => {
            res.status(500).json(
                { message: "getCalendarEvents failed!" }
            )
        });
};

exports.getCalendarEvent = (req, res, next) => {
    CalendarEventModel.findById(req.params.id).then(calendarEvent => {
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
    CalendarEventModel.deleteOne({ _id: req.params.id }).then(result => {
        console.log(result);
        if (result.deletedCount > 0) {
            res.status(200).json({ message: "Event deleted" });
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
    const calendarEvent = new CalendarEventModel({
        _id: req.params.id,
        title: req.body.title,
        start: req.body.start,
        end: req.body.end
    });
    console.log(calendarEvent);
    CalendarEventModel.updateOne({ _id: req.params.id/*, creator: req.userData.userId*/ }, calendarEvent).then(result => {
        if (result.matchedCount > 0) {
            res.status(200).json({ message: "Event edited" });
        }
        else {
            res.status(401).json({ message: "Not Authorized" });
        }
    })
        .catch(error => {
            res.status(500).json(
                { message: "Editing event failed!" }
            )
        });
};