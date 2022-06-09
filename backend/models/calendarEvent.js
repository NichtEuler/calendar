const mongoose = require("mongoose");

//wenn event recurring dann dürfen nur startzeit und endzeit und nicht start und enddateum angegeben werden
const calendarEventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    roomId: { type: String, required: true },
    allDay: { type: Boolean, required: false },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    startRecur: {
        type: Date, required: function () { return this.isRecur === true; }
    },
    endRecur: { type: Boolean, required: false },
    daysOfWeek: {
        type: [Number], required: function () { return this.isRecur === true; }
    },
    groupId: {
        type: String, required: function () { return this.isRecur === true; }
    }

});

module.exports = mongoose.model("CalendarEvent", calendarEventSchema);
