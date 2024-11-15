const CalendarEvent = require("../models/calendarEvent");


exports.createCalendarEvent = (req, res, next) => {
    console.log(req.body.extendedProps);
    const calendarEvent = new CalendarEvent({
        title: req.body.title,
        start: req.body.start,
        end: req.body.end,
        allDay: req.body.allDay,
        roomId: req.params.roomId,
        isImportant: req.params.isImportant,
        isRecur: req.body.isRecur,
        daysOfWeek: req.body.daysOfWeek,
        startRecur: req.body.startRecur,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        groupId: req.body.groupId,
        creator: req.userData.userId
    });
    console.log(calendarEvent);

    calendarEvent.save().then(createdCalendarEvent => {

        res.status(201).json({
            message: "Event sucessfully added!",
            calendarEvent: {
                id: createdCalendarEvent._id,
                ...createdCalendarEvent
            }
        });
    }).catch(error => {
        res.status(500).json({
            message: "Event creation failed!"
        })
    });

};

//holt alle Events
exports.getCalendarEvents = (req, res, next) => {
    CalendarEvent.find({ 'roomId': req.params.roomId }).then(calendarEvents => {
        if (calendarEvents) {
            res.status(200).json({ message: "Events fetched successfully", calendarEvents: calendarEvents });
        } else {
            res.status(404).json({ message: "No Events found!" });
        }
    })
        .catch(error => {
            res.status(500).json(
                { message: "Could not fetch events!" }
            )
        });
};

exports.getCalendarEvent = (req, res, next) => {
    CalendarEvent.findById(req.params.id).then(calendarEvent => {
        if (req.params.id) {
            res.status(200).json(calendarEvent);
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

///////////////////////////////////////////////////////
//holt die nächsten 3 Events eines Raumes
//Problem: alldayevent nicht kollisionsfrei mit 
//normalen events an gleichem tag 
//-> dann verkackt er schwellenevent weil einmaligkeit 
//angenommen wurde 16.05.22

//Daten:
//1 NUR DATE VON HEUTE 2-4 Events oder leere Events wenn keine vorhanden
exports.getNextEvents = (req, res, next) => {
    CalendarEvent.find({ 'roomId': req.params.roomId }).then(calendarEvents => {
        let emptyEvent = new CalendarEvent({
            title: "empty Event",
            start: null,
            end: null,
            allDay: null,
            roomId: null,
            creator: null
        });



        let length = req.query.length === undefined ? 3 : req.query.length; //if length param not given use 3 elements
        length = length <= 3 ? 3 : req.query.length // if lenght smaler than 3 return 3 elements

        //nächste 3 events in nextEvents, today (Date type) seperat verschicken
        let today = new Date(Date.now());
        //mit dummys füllen
        let nextEvents = Array.from({ length: length }, () => (emptyEvent));
        // let nextEvents = new Array(3);
        // nextEvents[0] = emptyEvent;
        // nextEvents[1] = emptyEvent;
        // nextEvents[2] = emptyEvent;

        //Date aussehen: "start": "2022-05-20T08:00:00.000Z",

        //am besten alles sortieren und dann erste 3 nach today ausgeben
        //array sortieren
        calendarEvents.sort((a, b) => a.start - b.start);


        //schauen ob ein Event gerade läuft (threshold) und an erste stelle setzen
        let threshold = false;
        calendarEvents.forEach(ev => {
            if ((ev.start - today < 0) && (ev.end - today > 0)) {
                threshold = true;
                nextEvents[0] = ev;
            }
        });

        //HIER NOCH DIE STARTSTELLE AUSLESEN WO ERSTES MAL start-today > 0
        let count = 0;
        let foundstart = false; //schauen ob passende events gefunden wurden -> sonst leere events geben
        for (let index = 0; index < calendarEvents.length; ++index) {
            const ev = calendarEvents[index];
            if (ev.start - today > 0) {
                count = index;
                foundstart = true;
                break;
            }
        }

        //Events zuordnen jenachdem ob grad eins läuft (schwellenevent)
        let position = 0;
        if (threshold) {
            position = 1;
        } else {
            position = 0;
        }
        //nextEvents füllen (out of Bounds verhindert)
        while ((count < calendarEvents.length) && (position < nextEvents.length)) {
            if (foundstart) {
                nextEvents[position++] = calendarEvents[count++];
            } else {
                //wenn kein startpunkt gefunden wurde werden empty events eingefüllt - funktioniert mit schwellenevent in combo
                nextEvents[position++] = emptyEvent;
            }
        }
        // TODO: wenn keine events an diesem tag auch keine ausgeben


        // fehlerabfrage hier fixen/löschen/irgendwas?
        if (true) {
            res.status(200).json({ message: "Next 3 Events fetched successfullyyyy", today: today, nextEvents: nextEvents });
        } else {
            res.status(404).json({ message: "Next 3 Events not found!" });
        }
    })
        .catch(error => {
            res.status(500).json(
                { message: "Could not fetch next 3 events!" }
            )
        });
};

exports.deleteCalendarEvent = (req, res, next) => {
    CalendarEvent.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(result => {
        if (result.deletedCount > 0) {
            res.status(200).json({ message: "Event sucessfully deleted!" });
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
        _id: req.params.id,
        title: req.body.title,
        start: req.body.start,
        end: req.body.end,
        allDay: req.body.allDay,
        creator: req.userData.userId,
        isRecur: req.body.isRecur,
        isImportant: req.body.isImportant,
        startRecur: req.body.startRecur,
        daysOfWeek: req.body.daysOfWeek,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        groupId: req.body.groupId
    });
    CalendarEvent.updateOne({ _id: req.params.id, creator: req.userData.userId }, calendarEvent).then(result => {
        if (result.matchedCount > 0) {
            res.status(200).json({ message: "Event sucessfully edited!" });
        }
        else {
            res.status(401).json({ message: "You are not Authorized!" });
        }
    })
        .catch(error => {
            res.status(500).json(
                { message: "Editing event failed!" }
            )
        });
};