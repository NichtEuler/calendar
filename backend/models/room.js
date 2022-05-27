const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");


const roomSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    location: { type: String, required: true }
});

module.exports = mongoose.model("Room", roomSchema);