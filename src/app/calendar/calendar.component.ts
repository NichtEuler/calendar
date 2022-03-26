import { Component, Injectable, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CalendarOptions, DateComponent, DateSelectArg, EventApi, EventChangeArg, EventClickArg, EventInput, FullCalendarComponent } from '@fullcalendar/angular';
import deLocale from '@fullcalendar/core/locales/de';
import { EventModalComponent } from '../events/event-modal/event-modal.component';

@Component({
  selector: 'app-fullcalendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})

@Injectable({ providedIn: "root" })
export class CalendarComponent implements OnInit {
  @ViewChild('calendar') calendarComponent: FullCalendarComponent;
  TODAY_STR = new Date().toISOString().replace(/T.*$/, '');
  INITIAL_EVENTS: EventInput[] = [
    {
      title: 'event 2',
      id: "123",
      start: this.TODAY_STR + 'T10:00:00',
      end: this.TODAY_STR + 'T11:00:00'

    },
    {
      id: 'a',
      title: 'my event',
      start: this.TODAY_STR + 'T11:00:00'
    },
    {
      id: "createEventId",
      title: 'Timed event',
      start: this.TODAY_STR + 'T23:00:00'
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
    },
    /* you can update a remote database when these fire:
    eventAdd:*/
    eventChange: this.handleEventChanged.bind(this),
    /*
    eventRemove:
    */

  };

  handleDateSelect(selectInfo: DateSelectArg) {
    const dialogRef = this.dialog.open(EventModalComponent, {
      data: {
        event: selectInfo
      }
    });
  }

  handleEventClick(clickInfo: EventClickArg) {
    console.log(clickInfo.event)
    this.dialog.open(EventModalComponent, {
      data: {
        event: clickInfo.event
      }
    });

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log(result);
    // })

    // const eventi = this.calendarComponent.getApi().getEventById("123");
    // const startt = new Date('March 19, 2022 03:15:30')
    // const endd = new Date('March 19, 2022 13:15:30')
    // eventi.setDates(startt, endd)
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

  handleEvents(events: EventApi[]) {
    console.log(events.toString())
  }

  handleEventChanged(changeInfo: EventChangeArg) {
    console.log(changeInfo.event + ": " + changeInfo.event.id);
  }


}
