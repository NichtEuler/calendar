const mongoose = require("mongoose");
//import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    location: { type: String, required: true }
});

module.exports = mongoose.model("Room", roomSchema);