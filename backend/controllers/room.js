const room = require("../models/room");

exports.createRoom = (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const room = new Room({
        id: req.body._id,
        name: req.body.content,
        location: url + "/images/" + req.file.filename,
        facility: req.userData.userId
    });
    room.save().then(createdRoom => {
        res.status(201).json({
            message: "Event sucessfully added",
            calendarEvent: {
                ...createdRoom,
                id: createdRoom._id
            }
        });
    }).catch(error => {
        res.status(500).json({
            message: "Event creation failed"
        })
    });

};