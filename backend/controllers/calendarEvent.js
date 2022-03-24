
const CalendarEvent = require("../models/calendarEvent");


exports.createCalendarEvent = (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const calendarEvent = new CalendarEvent({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + "/images/" + req.file.filename,
        creator: req.userData.userId
    });
    calendarEvent.save().then(createdCalendarEvent => {
        res.status(201).json({
            message: "Event sucessfully added",
            calendarEvent: {
                ...createdCalendarEvent,
                id: createdCalendarEvent._id
            }
        });
    }).catch(error => {
        res.status(500).json({
            message: "Event creation failed"
        })
    });

};

// exports.getCalendarEvents = (req, res, next) => {
//     const startDate = +req.query.startDate;
//     const endDate = +req.query.endDate;
//     const postQuery = CalendarEvent.find();
//     let fetchedCalendarEvents;
//     if (startDate && endDate) {
//         postQuery.skip(startDate * (endDate)).limit(startDate);
//     }
//     postQuery
//         .then(documents => {
//             fetchedCalendarEvents = documents;
//             return CalendarEvent.count();
//         })
//         .then(count => {
//             res.status(200).json({
//                 message: "Posts fetched sucessfully",
//                 posts: fetchedCalendarEvents,
//                 maxPosts: count
//             });
//         })
//         .catch(error => {
//             res.status(500).json(
//                 { message: "Fetching posts failed!" }
//             )
//         });
// };

exports.getCalendarEvent = (req, res, next) => {
    CalendarEvent.findById(req.params.id).then(post => {
        if (post) {
            res.status(200).json(post);
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

exports.deletePost = (req, res, next) => {
    CalendarEvent.deleteOne({ _id: req.params.id }).then(result => {
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
    const calendarEvent = new CalendarEvent({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath,
        creator: req.userData.userId
    });
    CalendarEvent.updateOne({ _id: req.params.id, creator: req.userData.userId }, post).then(result => {
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