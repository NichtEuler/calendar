const path = require("path")

const express = require("express");

const mongoose = require("mongoose");

const calendarEventRoutes = require("./routes/calendarEvent");
const userRoutes = require("./routes/user");
const roomRoutes = require("./routes/room")


const app = express();
const url = "mongodb+srv://max:" + process.env.MONGO_ATLAS_PW + "@cluster0.eyuvr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

mongoose.connect(url)
    .then(() => {
        console.log("Connected");
    })
    .catch(() => {
        console.log("Something went wrong")
        console.log(url)
    });

app.use(express.json());
app.use(express.urlencoded({ extended: false }))

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    next();
});

app.use("/api/events", calendarEventRoutes);
app.use("/api/user", userRoutes);
app.use("/api/rooms", roomRoutes)

module.exports = app;