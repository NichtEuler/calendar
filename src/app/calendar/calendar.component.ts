import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CalendarApi, CalendarOptions, DateSelectArg, EventApi, EventChangeArg, EventClickArg, EventDropArg, EventInput, FullCalendarComponent } from '@fullcalendar/angular';
import deLocale from '@fullcalendar/core/locales/de';
import { EventResizeDoneArg } from '@fullcalendar/interaction';
import { Subscription } from 'rxjs';
import { CalendarEventService } from '../events/calendarEvent.service';
import { EventModalComponent } from '../events/event-modal/event-modal.component';

@Component({
  selector: 'app-fullcalendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})

export class CalendarComponent implements OnInit, OnDestroy {

  @ViewChild('calendar') calendarComponent: FullCalendarComponent;

  private calendarEventsUpdated: Subscription;
  private calendarEventUpdated: Subscription;
  private calendarEventAdded: Subscription;
  currentEvents: EventApi[] = [];

  constructor(public calenderEventService: CalendarEventService, public dialog: MatDialog) {
    calenderEventService.getEvents();
  }
  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    this.calendarEventAdded = this.calenderEventService.getCalendarAddedListener()
      .subscribe((calendarEventData: { calendarEvent: EventApi }) => {
        this.calendarComponent.getApi().addEvent(calendarEventData.calendarEvent);
      });

    this.calendarEventsUpdated = this.calenderEventService.getCalendarEventsUpdateListener()
      .subscribe((calendarEventData: { calendarEvents: EventApi[] }) => {
        this.calendarComponent.getApi().addEventSource(calendarEventData.calendarEvents);
      });

    this.calendarEventUpdated = this.calenderEventService.getCalendarEventUpdateListener()
      .subscribe((calendarEventData: { calendarEvent: EventApi, isDeleted: boolean }) => {
        if (calendarEventData.isDeleted) {
          this.calendarComponent.getApi().getEventById(calendarEventData.calendarEvent.id).remove();
        }
        else {
          let calEvent = this.calendarComponent.getApi().getEventById(calendarEventData.calendarEvent.id);
          calEvent.setProp("title", calendarEventData.calendarEvent.title);
          console.log(calendarEventData.calendarEvent.allDay);
          calEvent.setDates(calendarEventData.calendarEvent.start, calendarEventData.calendarEvent.end);
          calEvent.setAllDay(calendarEventData.calendarEvent.allDay);
        }
      });

  }

  calendarOptions: CalendarOptions = {
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay',
    },
    initialView: 'timeGridWeek',
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    nowIndicator: true,
    eventOverlap: false,
    slotEventOverlap: false,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventDrop: this.handleEventDrop.bind(this),
    eventResize: this.handleEventResize.bind(this),
    locale: deLocale,
    firstDay: 1,
    height: screen.height - screen.height / 4,
    businessHours: {
      // days of week. an array of zero-based day of week integers (0=Sunday)
      daysOfWeek: [1, 2, 3, 4, 5, 6], // Monday - Friday

      startTime: '08:00', // a start time
      endTime: '20:00', // an end time
    },
  };

  handleDateSelect(selectInfo: DateSelectArg) {
    const dialogRef = this.dialog.open(EventModalComponent, {
      data: {
        event: selectInfo
      }
    });
  }

  handleEventClick(clickInfo: EventClickArg) {
    console.log(clickInfo.event.id)
    this.dialog.open(EventModalComponent, {
      data: {
        event: clickInfo.event
      }
    });
  }

  extractTimeString(date: Date) {
    if (date === null) {
      return null;
    }
    let hours = ("0" + date.getHours()).slice(-2);
    let minutes = ("0" + date.getMinutes()).slice(-2);
    let timeString = hours + ':' + minutes;
    return timeString;
  }

  handleEventDrop(eventDropinfo: EventDropArg) {
    this.calenderEventService.updateCalendarEvent(eventDropinfo.event);
  }

  handleEventResize(eventResizeInfo: EventResizeDoneArg) {
    this.calenderEventService.updateCalendarEvent(eventResizeInfo.event);
  }


}
