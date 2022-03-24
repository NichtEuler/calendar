
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

const BACKEND_URL = environment.apiUrl + "/events";

@Injectable({ providedIn: "root" })
export class CalendarEventService {


    constructor() { }


    updateCalendarEvent() {
        console.log("test")
        //sconst test = this.calendarComponent.getApi();
        //console.log(test);
    }

    addCalendarEvent() {

    }

    deleteCalendarEvent(id: String) {

    }
}