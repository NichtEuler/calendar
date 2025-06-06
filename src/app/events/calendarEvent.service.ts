import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar as MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { EventApi } from '@fullcalendar/core';
import { userInfo } from 'os';
import { lastValueFrom, map, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CalendarEvent } from './calendarEvent.model';

const BACKEND_URL = environment.apiUrl + '/events';

@Injectable({ providedIn: 'root' })
export class CalendarEventService {
  private calEvents: EventApi[] = [];
  private calendarEventsUpdated = new Subject<{ calendarEvents: EventApi[] }>();
  private calendarEventUpdated = new Subject<{
    calendarEvent: EventApi;
    isDeleted: boolean;
  }>();
  private calendarEventAdded = new Subject<{ calendarEvent: EventApi }>();

  constructor(private http: HttpClient) {}

  getEvents(roomId: string) {
    this.http
      .get<{ message: string; calendarEvents: any }>(BACKEND_URL + '/' + roomId)
      .pipe(
        map((calendarEventData) => {
          return {
            events: calendarEventData.calendarEvents.map((calEvent) => {
              return {
                id: calEvent._id,
                title: calEvent.title,
                start: calEvent.start,
                end: calEvent.end,
                roomId: calEvent.roomId,
                allDay: calEvent.allDay,
                groupId: calEvent.groupId,
                isRecur: calEvent.isRecur,
                isImportant: calEvent.isImportant,
                daysOfWeek: calEvent.daysOfWeek,
                startTime: calEvent.startTime,
                endTime: calEvent.endTime,
                startRecur: calEvent.startRecur,
              };
            }),
          };
        })
      )
      .subscribe((transformedCalendarEvents) => {
        transformedCalendarEvents.events.forEach((event) => {
          event.backgroundColor =
            event.isImportant === true
              ? 'red'
              : event.isRecur
              ? 'lightblue'
              : event.allDay
              ? 'green'
              : 'blue';
          console.log(
            event.isImportant === true
              ? 'red'
              : event.isRecur
              ? 'lightblue'
              : event.allDay
              ? 'green'
              : 'blue'
          );
        });
        this.calEvents = transformedCalendarEvents.events;
        this.calendarEventsUpdated.next({
          calendarEvents: [...this.calEvents],
        });
      });
  }

  getEventCreator(event_id: string) {
    return this.http
      .get<{
        message: string;
        calendarEvent: CalendarEvent;
      }>(BACKEND_URL + '/event/' + event_id)
      .pipe(map((response) => response.calendarEvent.creator));
  }

  async getUsername(event_id: string) {
    const creatorId$ = this.getEventCreator(event_id);
    const creatorId = await lastValueFrom(creatorId$);
    return this.http
      .get<{ username: string }>(environment.apiUrl + '/user/' + creatorId)
      .pipe(map((response) => response.username));
  }

  async getCalendarEvent(eventId) {
    return this.http
      .get<{ message: string; calendarEvent: CalendarEvent }>(
        BACKEND_URL + '/event/' + eventId
      )
      .pipe(map((response) => response.calendarEvent));
  }

  updateCalendarEvent(calendarEvent) {
    // const test = this.calendarComponent.calendarComponent.getApi();
    //hier snackbar oder ähnliches einfügen event gespeichert
    let calendarEventData: any;
    console.log('hier schauen');

    console.log(calendarEvent);

    calendarEventData = {
      id: calendarEvent.id,
      title: calendarEvent.title,
      start: calendarEvent.start,
      end: calendarEvent.end,
      allDay: calendarEvent.allDay,
      roomId: calendarEvent.roomId,
      isRecur: calendarEvent.isRecur,
      isImportant: calendarEvent.isImportant,
      daysOfWeek: calendarEvent.daysOfWeek,
      startRecur: calendarEvent.startRecur,
      startTime: calendarEvent.startTime,
      endTime: calendarEvent.endTime,
      groupId: calendarEvent.groupId,
    };

    this.http
      .put<{ message: string }>(
        BACKEND_URL + '/' + calendarEvent.id,
        calendarEventData
      )
      .subscribe((response) => {
        this.calendarEventUpdated.next({
          calendarEvent: calendarEventData,
          isDeleted: false,
        });
      });
  }

  createCalendarEvent(calendarEvent) {
    this.http
      .post<{ message: string; calendarEvent: CalendarEvent }>(
        BACKEND_URL + '/' + calendarEvent.roomId,
        calendarEvent
      )
      .subscribe((responseData) => {
        calendarEvent.id = responseData.calendarEvent.id;
        this.calendarEventAdded.next({ calendarEvent: calendarEvent });
      });
  }

  deleteCalendarEvent(calendarEvent: EventApi) {
    this.http
      .delete<{ message: string }>(BACKEND_URL + '/' + calendarEvent.id)
      .subscribe((responseData) => {
        this.calendarEventUpdated.next({
          calendarEvent: calendarEvent,
          isDeleted: true,
        });
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
