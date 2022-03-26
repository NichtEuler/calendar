
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { CalendarComponent } from "../calendar/calendar.component";

const BACKEND_URL = environment.apiUrl + "/events";

@Injectable({ providedIn: "root" })
export class CalendarEventService {


    constructor(public calendarComponent: CalendarComponent) { }


    updateCalendarEvent() {
       // const test = this.calendarComponent.calendarComponent.getApi();
        //console.log(test);
    }

    addCalendarEvent() {

    }

    deleteCalendarEvent(id: String) {

    }
}