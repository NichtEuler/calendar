import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { EventApi } from "@fullcalendar/angular";
import { userInfo } from "os";
import { lastValueFrom, map, Subject } from "rxjs";
import { environment } from "src/environments/environment";
import { CalendarEvent } from "./calendarEvent.model";

const BACKEND_URL = environment.apiUrl + "/events";

@Injectable({ providedIn: "root" })
export class CalendarEventService {
    private calEvents: EventApi[] = [];
    private calendarEventsUpdated = new Subject<{ calendarEvents: EventApi[] }>();
    private calendarEventUpdated = new Subject<{ calendarEvent: EventApi, isDeleted: boolean }>();
    private calendarEventAdded = new Subject<{ calendarEvent: EventApi }>();


    constructor(private http: HttpClient) { }


    getEvents(roomId: string) {
        this.http.get<{ message: string, calendarEvents: any }>(BACKEND_URL + "/" + roomId)
            .pipe(map(calendarEventData => {
                return {
                    events: calendarEventData.calendarEvents.map(calEvent => {
                        return {
                            id: calEvent._id,
                            title: calEvent.title,
                            start: calEvent.start,
                            end: calEvent.end,
                            roomId: calEvent.roomId,
                            allDay: calEvent.allDay
                        };
                    }),
                };
            }))
            .subscribe(transformedCalendarEvents => {
                this.calEvents = transformedCalendarEvents.events;
                this.calendarEventsUpdated.next({ calendarEvents: [...this.calEvents] });
            });
    }


    getEventCreator(id: string) {
        return this.http.get<{ _id: string, title: string, content: string, imagePath: string, creator: string }>
            (BACKEND_URL + "/event/" + id).pipe(map(response => response.creator));
    }

    async getUsername(id: string) {
        const creatorId$ = this.getEventCreator(id);
        const creatorId = await lastValueFrom(creatorId$);
        return this.http.get<{ username: string }>(environment.apiUrl + "/user/" + creatorId)
            .pipe(map(response => response.username));
    }



    updateCalendarEvent(calendarEvent) {
        // const test = this.calendarComponent.calendarComponent.getApi();
        //hier snackbar oder ähnliches einfügen event gespeichert
        let calendarEventData: any;
        calendarEventData = {
            id: calendarEvent.id,
            title: calendarEvent.title,
            start: calendarEvent.start,
            end: calendarEvent.end,
            allDay: calendarEvent.allDay
        }

        this.http.put<{ message: string }>(BACKEND_URL + "/" + calendarEvent.id, calendarEventData)
            .subscribe(response => {
                //panelClass: ['mat-toolbar', 'mat-primary'] 'mat-primary' to 'mat-accent' or 'mat-warn'
                this.calendarEventUpdated.next({ calendarEvent: calendarEventData, isDeleted: false });
            });

    }

    createCalendarEvent(calendarEvent) {
        let calendarEventData: CalendarEvent;
        calendarEventData = {
            id: null,
            title: calendarEvent.title,
            start: calendarEvent.start,
            end: calendarEvent.end,
            allDay: calendarEvent.allDay,
            roomId: calendarEvent.roomId
        }
        this.http.post<{ message: string; calendarEvent: CalendarEvent }>(BACKEND_URL + "/" + calendarEvent.roomId, calendarEventData)
            .subscribe(responseData => {
                calendarEvent.id = responseData.calendarEvent.id
                this.calendarEventAdded.next({ calendarEvent: calendarEvent });
                (responseData.calendarEvent);
            });
    }

    deleteCalendarEvent(calendarEvent: EventApi) {
        this.http.delete<{ message: string }>(BACKEND_URL + "/" + calendarEvent.id)
            .subscribe(responseData => {
                this.calendarEventUpdated.next({ calendarEvent: calendarEvent, isDeleted: true })

            });
        //snackbar
    }

    getCalendarEventsUpdateListener() {
        return this.calendarEventsUpdated.asObservable();
    }

    getCalendarEventUpdateListener() {
        return this.calendarEventUpdated.asObservable();
    }

    getCalendarAddedListener() {
        return this.calendarEventAdded.asObservable();
    }
}