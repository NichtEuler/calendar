const mongoose = require("mongoose");


//wenn event recurring dann dürfen nur startzeit und endzeit und nicht start und enddateum angegeben werden
const calendarEventSchema = new mongose.Schema({
    title: { type: String, required: true },
    allDay: { type: Boolean, required: true },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    isRecur: { type: Boolean, required: true },
    startRecur: { type: Date, required: function() { return this.isRecur === true; } },
    endRecur: { type: Date, required: function() { return this.isRecur === true; } },
    daysOfWeek: { type: Number, required: function() { return this.isRecur === true; }},
    room: { type: String, required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

module.exports = mongoose.model("CalendarEvent", calendarEventSchema);
