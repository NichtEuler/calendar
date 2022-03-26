const Room = require("../models/room");

exports.createRoom = (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const room = new Room({
        id: req.body._id,
        name: req.body.name,
        location: req.body.location,
        facility: req.body.facility
    });
    room.save().then(createdRoom => {
        res.status(201).json({
            message: "room sucessfully added",
            room: {
                ...createdRoom,
                id: createdRoom._id
            }
        });
    }).catch(error => {
        res.status(500).json({
            message: "room creation failed"
        })
    });
};

exports.editRoom = (req, res, next) => {
    const room = new Room({
        _id: req.body.id,
        name: req.body.name,
        location: req.body.location
    });
    Room.updateOne({ _id: req.params.id }, post).then(result => {
        if (result.matchedCount > 0) {
            res.status(200).json({ message: "Post edited" });
        }
        else {
            res.status(401).json({ message: "something went wrong" });
        }
    })
        .catch(error => {
            res.status(500).json(
                { message: "Editing room failed!" }
            )
        });
}