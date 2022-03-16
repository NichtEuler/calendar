import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Calendar, CalendarOptions, DateSelectArg, EventApi, EventClickArg, EventInput } from '@fullcalendar/angular';
import deLocale from '@fullcalendar/core/locales/de';
import { EventModalComponent } from '../events/event-modal/event-modal.component';

@Component({
  selector: 'app-fullcalendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  TODAY_STR = new Date().toISOString().replace(/T.*$/, '');
  INITIAL_EVENTS: EventInput[] = [
    {
      id: "123",
      title: 'All-day event',
      start: this.TODAY_STR
    },
    {
      id: "createEventId()",
      title: 'Timed event',
      start: this.TODAY_STR + 'T24:00:00'
    }
  ];
  currentEvents: EventApi[] = [];

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  calendarOptions: CalendarOptions = {
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay',
    },
    initialView: 'dayGridMonth',
    initialEvents: this.INITIAL_EVENTS,
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    nowIndicator: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    locale: deLocale,
    firstDay: 1,
    height: screen.height - screen.height / 4,
    businessHours: {
      // days of week. an array of zero-based day of week integers (0=Sunday)
      daysOfWeek: [1, 2, 3, 4, 5, 6], // Monday - Friday

      startTime: '08:00', // a start time (10am in this example)
      endTime: '20:00', // an end time (6pm in this example)
    }
    /* you can update a remote database when these fire:
    eventAdd:
    eventChange:
    eventRemove:
    */

  };

  handleDateSelect(selectInfo: DateSelectArg) {
    const dialogRef = this.dialog.open(EventModalComponent, {
      data: { title: selectInfo.startStr, date: selectInfo.startStr, startTime: selectInfo.start, endTime: selectInfo.end }
    });
  }

  handleEventClick(clickInfo: EventClickArg) {
    const dialogRef = this.dialog.open(EventModalComponent, {
      data: { title: clickInfo.event.title, date: clickInfo.event.startStr, startTime: clickInfo.event.start, endTime: clickInfo.event.end, isExisting: true }
    });
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
  }

}
