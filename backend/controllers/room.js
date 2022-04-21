const Room = require("../models/room");

exports.getRooms = (req, res, next) => {
    Room.find().then(rooms => {
        if (rooms) {
            res.status(200).json({ message: "Rooms fetched successfully", rooms: rooms });
        } else {
            res.status(404).json({ message: "No Rooms found!" });
        }
    })
        .catch(error => {
            res.status(500).json(
                { message: "Getting rooms failed failed!" }
            )
        });
};

exports.getRoom = (req, res, next) => {
    console.log(req.params.id);
    Room.findById(req.params.id).then(room => {
        if (room) {
            console.log(room);
            res.status(200).json({ message: "Room fetched sucessfully!", room: room });
        } else {
            res.status(404).json({ message: "Room not found!" });
        }
    })
        .catch(error => {
            res.status(500).json(
                { message: "Fetching room failed!" }
            )
        });
};

exports.createRoom = (req, res, next) => {
    const room = new Room({
        name: req.body.name,
        location: req.body.location,
    });
    room.save().then(createdRoom => {
        res.status(201).json({
            message: "room sucessfully added",
            room: {
                id: createdRoom._id,
                ...createdRoom
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