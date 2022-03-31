const mongoose = require("mongoose");


//wenn event recurring dann dürfen nur startzeit und endzeit und nicht start und enddateum angegeben werden
const calendarEventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    start: { type: String, required: true },
    end: { type: String, required: true },
    allDay: { type: Boolean, required: false }
    // isRecur: { type: Boolean, required: true },
    // startRecur: { type: Date, required: function() { return this.isRecur === true; } },
    // endRecur: { type: Date, required: function() { return this.isRecur === true; } },
    // daysOfWeek: { type: Number, required: function() { return this.isRecur === true; }},
    // room: { type: String, required: true },
    // creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

module.exports = mongoose.model("CalendarEventModel", calendarEventSchema);
