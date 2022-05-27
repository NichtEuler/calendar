import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CalendarEventService } from '../calendarEvent.service';
import { EventApi } from '@fullcalendar/angular';
import { lastValueFrom } from 'rxjs';

export interface CalendarEvent {
  event: EventApi,
  roomId: string,
  userId: string
}

@Component({
  selector: 'app-event-modal',
  templateUrl: './event-modal.component.html',
  styleUrls: ['./event-modal.component.css']
})
export class EventModalComponent implements OnInit {

  form: FormGroup;
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  isRecurring: boolean;
  allDay: boolean;
  roomId: string;
  userId: string;
  creatorId: string;
  eventId: string;
  username: string;


  constructor(
    public calendarEventService: CalendarEventService,
    public dialogRef: MatDialogRef<EventModalComponent>,
    @Inject(MAT_DIALOG_DATA) public eventApi: CalendarEvent) {
    this.startDate = eventApi.event.start;
    this.startTime = this.extractTimeString(this.startDate);
    this.eventId = eventApi.event.id;
    this.endDate = eventApi.event.end;
    if (!this.endDate) {
      this.endDate = eventApi.event.start;
    }
    this.endTime = this.extractTimeString(this.endDate);

    if (eventApi.event.allDay) {
      this.allDay = eventApi.event.allDay;
    }
    else {
      this.allDay = false;
    }
    this.userId = eventApi.userId;
    this.isRecurring = false;
    this.roomId = eventApi.roomId;
  }

  async ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, { validators: [Validators.required, Validators.minLength(3), Validators.maxLength(15)] }),
      startDate: new FormControl(null, { validators: [Validators.required] }),
      endDate: new FormControl(null, { validators: [Validators.required] }),
      startTime: new FormControl({ value: "", disabled: this.eventApi.event.allDay }, { validators: [Validators.required] }),
      endTime: new FormControl({ value: "", disabled: this.eventApi.event.allDay }, { validators: [Validators.required] }),
      allDay: new FormControl(null, { validators: [Validators.required] }),
      recurringEvent: new FormControl(null),
      //endRecur: new FormControl(null)
    });
    this.onAllDayCheckboxChange();
    if (this.eventId) {
      const username$ = await this.calendarEventService.getUsername(this.eventId);
      this.username = await lastValueFrom(username$);
    }
    else {
      this.username = localStorage.getItem("username");
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }

    this.setTime();
    if (this.eventApi.event.id) {
      //verändere bestehendes event
      const calEvent = {
        id: this.eventApi.event.id,
        title: this.form.get("title").value,
        start: this.startDate,
        end: this.endDate,
        allDay: this.allDay,
        roomId: this.roomId
      }
      this.calendarEventService.updateCalendarEvent(calEvent);

    }
    else {
      const calEvent = {
        title: this.form.get("title").value,
        start: this.startDate,
        end: this.endDate,
        allDay: this.allDay,
        roomId: this.roomId
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
      this.form.controls["startTime"].enable()
      this.form.controls["endTime"].enable()
    }
    else {
      this.form.controls["startTime"].disable()
      this.form.controls["endTime"].disable()
    }
  }

  extractTimeString(date: Date) {
    if (date === null) {
      return "00:00";
    }
    let hours = ("0" + date.getHours()).slice(-2);
    let minutes = ("0" + date.getMinutes()).slice(-2);
    let timeString = hours + ':' + minutes;
    return timeString;
  }

  setTime() {
    if (this.startDate !== null && this.startTime !== null) {
      const splitStart = this.startTime.split(":")
      this.startDate.setHours(Number(splitStart[0]), Number(splitStart[1]))
    }
    if (this.endDate !== null && this.endTime !== null) {
      const splitEnd = this.endTime.split(":")
      this.endDate.setHours(Number(splitEnd[0]), Number(splitEnd[1]))
    }
  }
}




