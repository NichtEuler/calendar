import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { CalendarOptions, DateSelectArg, EventApi, EventClickArg, EventDropArg, FullCalendarComponent } from '@fullcalendar/angular';
import deLocale from '@fullcalendar/core/locales/de';
import { EventResizeDoneArg } from '@fullcalendar/interaction';
import { lastValueFrom, Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { CalendarEventService } from '../events/calendarEvent.service';
import { EventModalComponent } from '../events/event-modal/event-modal.component';
import { HeaderTitleService } from '../header/headertitle.service';
import { RoomService } from '../rooms/room.service';

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
  private authStatusListenerSub: Subscription;
  private roomId: string;
  private userId;
  userIsAuthenticated: boolean;
  currentEvents: EventApi[] = [];

  constructor(public calenderEventService: CalendarEventService,
    public dialog: MatDialog,
    public route: ActivatedRoute,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router,
    private roomService: RoomService,
    private headerTitleService: HeaderTitleService) {
  }

  ngOnDestroy(): void {
    this.calendarEventAdded.unsubscribe();
    this.calendarEventUpdated.unsubscribe();
    this.calendarEventsUpdated.unsubscribe();
    this.authStatusListenerSub.unsubscribe();
  }

  ngOnInit(): void {
    this.userIsAuthenticated = this.authService.getIsAuthed();
    this.userId = this.authService.getUserId();
    this.authStatusListenerSub = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.calendarComponent.options.selectable = this.userIsAuthenticated;
        this.userId = this.authService.getUserId();
      });

    this.calendarEventAdded = this.calenderEventService.getCalendarAddedListener()
      .subscribe((calendarEventData: { calendarEvent: EventApi }) => {

        this.calendarComponent.getApi().addEvent(calendarEventData.calendarEvent);
      });

    this.calendarEventsUpdated = this.calenderEventService.getCalendarEventsUpdateListener()
      .subscribe((calendarEventData: { calendarEvents: EventApi[] }) => {
        console.log("calendarEventsUpdated " + calendarEventData.calendarEvents[1]);

        this.calendarComponent.getApi().addEventSource(calendarEventData.calendarEvents);
      });

    this.calendarEventUpdated = this.calenderEventService.getCalendarEventUpdateListener()
      .subscribe((calendarEventData: { calendarEvent: EventApi, isDeleted: boolean }) => {
        if (calendarEventData.isDeleted) {
          this.calendarComponent.getApi().getEventById(calendarEventData.calendarEvent.id).remove();
        }
        else {
          // let calEvent = this.calendarComponent.getApi().getEventById(calendarEventData.calendarEvent.id);
          // calEvent.setProp("title", calendarEventData.calendarEvent.title);
          // if (calendarEventData.calendarEvent.allDay) {
          //   calEvent.setDates(calendarEventData.calendarEvent.start, null, { allDay: calendarEventData.calendarEvent.allDay });
          // }
          // else {
          //   calEvent.setDates(calendarEventData.calendarEvent.start, calendarEventData.calendarEvent.end);
          // }
          this.calendarComponent.getApi().addEventSource(calendarEventData.calendarEvent);

        }
      });
  }

  //https://stackoverflow.com/questions/34947154/angular-2-viewchild-annotation-returns-undefined
  //otherwise the viewchild returns as undefined
  ngAfterViewInit() {
    let caughtRoom;
    this.route.paramMap.subscribe(async (paramMap: ParamMap) => {
      this.calendarComponent.getApi().removeAllEvents()
      if (paramMap.has("roomId")) {
        this.roomId = paramMap.get("roomId");
        const caughtRoom$ = await this.roomService.getRoom(this.roomId);
        caughtRoom = await lastValueFrom(caughtRoom$)
        this.calenderEventService.getEvents(this.roomId);
        this.headerTitleService.updateHeaderTitle(caughtRoom.name);
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
    selectAllow: this.selectAllow.bind(this),
    locale: deLocale,
    firstDay: 1,
    height: "auto",
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
        event: selectInfo,
        roomId: this.roomId,
        userId: this.userId
      }
    });
  }

  handleEventClick(clickInfo: EventClickArg) {
    if (this.userIsAuthenticated) {
      this.dialog.open(EventModalComponent, {
        data: {
          event: clickInfo.event,
          roomId: this.roomId,
          userId: this.userId
        }
      });
    } else {
      this.displayUnauthorizedSnackbar();
    }

  }
  selectAllow(selectAllow: DateSelectArg) {
    return this.userIsAuthenticated;
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

  async handleEventDrop(eventDropinfo: EventDropArg) {
    if (await this.isCreator(eventDropinfo.event.id)) {
      this.calenderEventService.updateCalendarEvent(eventDropinfo.event);
    }
    else {
      eventDropinfo.revert();
      this.displayUnauthorizedSnackbar();
    }
  }

  async handleEventResize(eventResizeInfo: EventResizeDoneArg) {
    if (await this.isCreator(eventResizeInfo.event.id)) {
      this.calenderEventService.updateCalendarEvent(eventResizeInfo.event);
    } else {
      eventResizeInfo.revert();
      this.displayUnauthorizedSnackbar();
    }
  }

  async isCreator(eventId: string) {
    const eventCreator$ = this.calenderEventService.getEventCreator(eventId);
    let eventCreator = await lastValueFrom(eventCreator$);
    return (this.userId === eventCreator);
  }

  displayUnauthorizedSnackbar() {
    //eventuell snackbar mit nachricht dass dieses event nicht von einem selbst ist
    this.snackBar.open("You are not authorized!", 'Close', { duration: 5000, panelClass: ['error-snackbar'] });
  }
}
