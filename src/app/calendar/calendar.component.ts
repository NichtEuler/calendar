import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CalendarOptions, DateSelectArg, EventApi, EventClickArg, EventInput , FullCalendarComponent} from '@fullcalendar/angular';
import deLocale from '@fullcalendar/core/locales/de';
import { EventModalComponent } from '../events/event-modal/event-modal.component';

@Component({
  selector: 'app-fullcalendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  @ViewChild('calendar') calendarComponent: FullCalendarComponent;
  TODAY_STR = new Date().toISOString().replace(/T.*$/, '');
  INITIAL_EVENTS: EventInput[] = [
    {
      title: 'recur event',
      daysOfWeek: [ '6' ],
      startTime: '10:45:00',
      endTime: '12:45:00'
    },
    {
      title: 'recur event 2',
      daysOfWeek: [ '4' ],
      startTime: '10:30:00',
      endTime: '12:45:00'
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
    eventChange: this.handleEventChanged.bind(this)
    eventRemove:
    */

  };

  handleDateSelect(selectInfo: DateSelectArg) {
    const dialogRef = this.dialog.open(EventModalComponent, {
      data: { title: selectInfo.startStr, date: selectInfo.startStr,
         startTime: this.extractTimeString(selectInfo.start), 
         endTime: this.extractTimeString(selectInfo.end) }
    });
  }

  handleEventClick(clickInfo: EventClickArg) {
    let start = this.extractTimeString(clickInfo.event.start);
    let end = this.extractTimeString(clickInfo.event.end);
    const dialogRef = this.dialog.open(EventModalComponent, {
      data: {
        title: clickInfo.event.title, date: clickInfo.event.startStr,
        startTime: start,
        endTime: end, isExisting: true, isRecurring: true, allDay: false
      }
    });
  }

  extractTimeString(date: Date) {
    let hours = ("0" + date.getHours()).slice(-2);
    let minutes = ("0" + date.getMinutes()).slice(-2);
    let timeString = hours + ':' + minutes;
    return timeString;
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
  }

}
