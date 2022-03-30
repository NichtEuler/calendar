
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { EventApi } from "@fullcalendar/angular";
import { stringify } from "querystring";
import { map, Subject } from "rxjs";
import { environment } from "src/environments/environment";

const BACKEND_URL = environment.apiUrl + "/";

export interface Room {
    name: string
}

@Injectable({ providedIn: "root" })
export class CalendarEventService {
    private calEvents: EventApi[] = [];
    private calendarEventUpdated = new Subject<{ calendarEvents: EventApi[] }>();
    private calendarEventAdded = new Subject<{ calendarEvent: EventApi }>();


    constructor(private http: HttpClient, private router: Router) { }


    getEvents(room: Room) {
        this.http.get<{ message: string, events: any }>(BACKEND_URL + room.name)
            .pipe(map(eventData => {
                return {
                    events: eventData.events.map(calEvent => {
                        return {
                            id: calEvent._id,
                            title: calEvent.title,
                            start: calEvent.start,
                            end: calEvent.end

                        };
                    }),
                };
            }))
            .subscribe(transformedCalevents => {
                this.calEvents = transformedCalevents.events;
                this.calendarEventUpdated.next({ calendarEvents: [...this.calEvents] });
            });
    }

    getEvent(id: string, room: string) {
        return this.http.get<{ _id: string, title: string, content: string, imagePath: string, creator: string }>
            (BACKEND_URL + "/" + room + "/" + id);
    }

    handleEvent(calendarEvent: EventApi) {
        console.log(calendarEvent.id)
    }

    updateCalendarEvent() {
        // const test = this.calendarComponent.calendarComponent.getApi();
        //console.log(test);
    }

    addCalendarEvent(calendarEvent) {
        console.log("CalendarEventService: " + calendarEvent.allDay);

        this.calendarEventAdded.next({ calendarEvent: calendarEvent });
    }

    deleteCalendarEvent(id: String) {

    }

    getCalendarEventUpdateListener() {
        return this.calendarEventUpdated.asObservable();
    }

    getCalendarAddedListener() {
        return this.calendarEventAdded.asObservable();
    }

    editCalendarEvent(eventApi: EventApi, calEvent){
        eventApi.setProp("title", calEvent.title);
        eventApi.setStart(calEvent.startDate);
        eventApi.setDates(calEvent.startDate, calEvent.endDate, calEvent.allDay)
    }
}