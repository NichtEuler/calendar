import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CalendarEventService } from '../calendarEvent.service';
import { Calendar, EventApi } from '@fullcalendar/angular';

export interface CalendarEvent {
  event: EventApi
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


  constructor(
    public calendarEventService: CalendarEventService,
    public dialogRef: MatDialogRef<EventModalComponent>,
    @Inject(MAT_DIALOG_DATA) public eventApi: CalendarEvent) {
    this.startDate = eventApi.event.start;
    this.endDate = eventApi.event.end;
    this.startTime = this.extractTimeString(this.startDate);
    this.endTime = this.extractTimeString(this.endDate);
    this.allDay = eventApi.event.allDay;
    this.isRecurring = false;
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl(null, { validators: [Validators.required, Validators.minLength(3)] }),
      date: new FormControl(null, { validators: [Validators.required] }),
      startTime: new FormControl(null, { validators: [Validators.required] }),
      endTime: new FormControl({ value: "", disabled: this.eventApi.event.allDay }),
      allDay: new FormControl(null, { validators: [Validators.required] }),
      recurringEvent: new FormControl(null, { validators: [Validators.required] }),
      //endRecur: new FormControl(null)
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.form.invalid) {
      console.log(this.form.invalid)
      return;
    }
    console.log("hier wird event gespeichert: " + this.eventApi.event.id)
    if (this.eventApi.event.id) {
      //verändere bestehendes event
      const calEvent = {
        title: this.form.get("title").value,
        startDate: this.startDate,
        endDate: this.endDate,
        allDay: this.form.get("allDay").value
      }
      this.calendarEventService.editCalendarEvent(this.eventApi.event, calEvent)

    } else {
      const calEvent = {
        title: this.form.get("title").value,
        start: this.startDate,
        end: this.endDate,
        allDay: this.form.get("allDay").value
      }
      this.calendarEventService.addCalendarEvent(calEvent);
    }
    //hier snackbar oder ähnliches einfügen
    this.dialogRef.close(this.eventApi);
  }

  onDeleteEvent() {
    this.eventApi.event.remove();
    this.dialogRef.close();
  }

  onAllDayCheckboxChange() {
    if (!this.allDay) {
      this.form.controls["startTime"].disable()
      this.form.controls["endTime"].disable()
    }
    else {
      this.form.controls["startTime"].enable()
      this.form.controls["endTime"].enable()
    }
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
}
