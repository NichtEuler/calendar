
import { environment } from "src/environments/environment";
import { CalendarComponent } from "../calendar/calendar.component";
import { CalendarEvent } from "./calendarEvent.model";
import { FullCalendarComponent } from "@fullcalendar/angular";


const BACKEND_URL = environment.apiUrl + "/events";

export class CalendarEventService  {

    
    constructor(public calendarComponent: CalendarComponent){}
    

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