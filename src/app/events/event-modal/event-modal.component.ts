import { Component, Inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  UntypedFormControl,
  UntypedFormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import {
  MatDialogRef as MatDialogRef,
  MAT_DIALOG_DATA as MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { CalendarEventService } from '../calendarEvent.service';
import { EventApi } from '@fullcalendar/core';
import { lastValueFrom } from 'rxjs';
import { MyErrorStateMatcher } from 'src/app/auth/MyErrorStateMatcher';
import { v4 as uuid } from 'uuid';
import { start } from 'repl';

export interface CalendarEvent {
  event: EventApi;
  roomId: string;
  userId: string;
}

@Component({
  selector: 'app-event-modal',
  templateUrl: './event-modal.component.html',
  styleUrls: ['./event-modal.component.css'],
})
export class EventModalComponent implements OnInit {
  form: UntypedFormGroup;
  startDate: Date;
  endDate: Date;
  startTimeString: string;
  endTimeString: string;
  allDay: boolean;
  isImportant: boolean;
  roomId: string;
  userId: string;
  creatorId: string;
  daysOfWeek: [Number];
  startRecur: Date;
  startTime: string;
  endTime: string;
  eventId: string;
  username: string;
  isRecur: boolean;
  groupId: string;
  matcher = new MyErrorStateMatcher('negative');

  constructor(
    public calendarEventService: CalendarEventService,
    public dialogRef: MatDialogRef<EventModalComponent>,
    @Inject(MAT_DIALOG_DATA) public eventApi: CalendarEvent
  ) {
    this.startDate = eventApi.event.start;
    this.startTimeString = this.extractTimeString(this.startDate);
    this.eventId = eventApi.event.id;
    this.endDate = eventApi.event.end;
    if (!this.endDate) {
      this.endDate = eventApi.event.start;
    }
    this.endTimeString = this.extractTimeString(this.endDate);

    if (eventApi.event.allDay) {
      this.allDay = eventApi.event.allDay;
      this.endDate = this.startDate;
    } else {
      this.allDay = false;
    }
    console.log(eventApi.event.start);

    this.userId = eventApi.userId;

    console.log(eventApi.event.groupId);

    this.isRecur = eventApi.event.groupId !== 'null' ? true : false;

    this.groupId = null;
    this.roomId = eventApi.roomId;
  }

  async ngOnInit() {
    this.form = new UntypedFormGroup({
      title: new UntypedFormControl(null, {
        validators: [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(15),
          Validators.pattern('^[a-zA-Z0-9_ ]*$'),
        ],
      }),
      startDate: new UntypedFormControl(null, {
        validators: [Validators.required],
      }),
      endDate: new UntypedFormControl(null, {
        validators: [Validators.required],
      }),
      startTime: new UntypedFormControl(
        { value: '', disabled: this.eventApi.event.allDay },
        { validators: [Validators.required] }
      ),
      endTime: new UntypedFormControl(
        { value: '', disabled: this.eventApi.event.allDay },
        { validators: [Validators.required] }
      ),
      allDay: new UntypedFormControl(null, {
        validators: [Validators.required],
      }),
      isRecur: new UntypedFormControl(null, {
        validators: [Validators.required],
      }),
      isImportant: new UntypedFormControl(null, {
        validators: [Validators.required],
      }),
      //endRecur: new FormControl(null)
    });

    //Checkboxen default nicht angewählt (wenn event noch nicht besteht, sonst wie in event)
    if (this.eventApi.event.id == null) {
      this.isRecur = false;
    }

    this.onAllDayCheckboxChange();
    if (this.eventId) {
      const username$ = await this.calendarEventService.getUsername(
        this.eventId
      );
      this.username = await lastValueFrom(username$);
    } else {
      this.username = localStorage.getItem('username');
    }
  }

  ngAfterViewInit() {
    // will not work if added directly (maybe because its async)
    this.form.addValidators(this.isTimeValid());
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }

    this.setTime();
    console.log(this.startDate);
    this.groupId = uuid();

    if (this.isRecur) {
      this.daysOfWeek = [this.startDate.getDay()];
      this.startRecur = this.startDate;
      this.startTime = this.startTimeString;
      this.endTime = this.endTimeString;
      //wenn isRecur und allday angewählt darf keine start- und endttime vorhanden sein
      if (this.allDay) {
        this.startTime = null;
        this.endTime = null;
      }
    } else {
      this.daysOfWeek = null;
      this.startRecur = null;
      this.startTime = null;
      this.endTime = null;
    }

    if (this.allDay) {
      this.startTime = null;
      this.endTime = null;
    }

    if (this.eventApi.event.id) {
      //verändere bestehendes event
      const calEvent = {
        id: this.eventApi.event.id,
        title: this.form.get('title').value,
        start: this.startDate,
        end: this.endDate,
        allDay: this.allDay,
        isImportant: this.isImportant,
        roomId: this.roomId,
        isRecur: this.isRecur,
        daysOfWeek: this.daysOfWeek,
        startRecur: this.startRecur,
        startTime: this.startTime,
        endTime: this.endTime,
        groupId: this.groupId,
      };
      this.calendarEventService.updateCalendarEvent(calEvent);
    } else {
      const calEvent = {
        id: null,
        title: this.form.get('title').value,
        start: this.startDate,
        end: this.endDate,
        allDay: this.allDay,
        roomId: this.roomId,
        isRecur: this.isRecur,
        isImportant: this.isImportant,
        daysOfWeek: this.daysOfWeek,
        startRecur: this.startRecur,
        startTime: this.startTime,
        endTime: this.endTime,
        groupId: this.groupId,
      };
      this.calendarEventService.createCalendarEvent(calEvent);
    }
    this.dialogRef.close(this.eventApi);
  }

  onDeleteEvent() {
    this.calendarEventService.deleteCalendarEvent(this.eventApi.event);
    this.dialogRef.close();
  }

  onAllDayCheckboxChange() {
    if (!this.allDay) {
      this.form.controls['startTime'].enable();
      this.form.controls['endTime'].enable();
    } else {
      this.form.controls['startTime'].disable();
      this.form.controls['endTime'].disable();
    }
  }

  extractTimeString(date: Date) {
    if (date === null) {
      return '00:00';
    }
    let hours = ('0' + date.getHours()).slice(-2);
    let minutes = ('0' + date.getMinutes()).slice(-2);
    let timeString = hours + ':' + minutes;
    return timeString;
  }

  setTime() {
    if (this.startDate !== null && this.startTimeString !== null) {
      const splitStart = this.startTimeString.split(':');
      this.startDate.setHours(Number(splitStart[0]), Number(splitStart[1]));
    }
    if (this.endDate !== null && this.endTimeString !== null) {
      const splitEnd = this.endTimeString.split(':');
      this.endDate.setHours(Number(splitEnd[0]), Number(splitEnd[1]));
    }
  }

  isTimeValid() {
    return (control: AbstractControl): ValidationErrors | null => {
      let isAllowed;
      if (this.endDate <= this.startDate) {
        console.log(this.startDate.toDateString());
        console.log(this.endDate?.toDateString());
        console.log(
          this.endDate?.toDateString() <= this.startDate.toDateString()
        );

        isAllowed =
          this.form.controls.endTime.value > this.form.controls.startTime.value;
      } else {
        isAllowed = true;
      }

      isAllowed = isAllowed || this.form.controls.allDay.value;
      return isAllowed ? null : { negative: true };
    };
  }
}
