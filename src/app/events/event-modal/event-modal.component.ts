import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CalendarEventService } from '../calendarEvent.service';
import { Subscription } from "rxjs";
import { EventApi } from "@fullcalendar/angular";

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
  calendarEventSub: Subscription;
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  isRecurring: boolean;


  constructor(
    public calendarEventService: CalendarEventService,
    public dialogRef: MatDialogRef<EventModalComponent>,
    @Inject(MAT_DIALOG_DATA) public eventApi: CalendarEvent) {
    this.startDate = eventApi.event.start;
    this.endDate = eventApi.event.end;
    this.startTime = this.extractTimeString(this.startDate);
    this.endTime = this.extractTimeString(this.endDate);
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

  onSaveEvent() {
    if (this.form.invalid) {
      return;
    }
    console.log("hier wird event gespeichert")
    if (this.eventApi.event.id) {
      //veränder bestehendes event
      this.eventApi.event.setProp("title", this.form.get("title").value)
      this.eventApi.event.setStart(this.startDate)
    } else {
      //mach neues event
    }
    this.dialogRef.close(this.eventApi);
  }

  onDeleteEvent() {
    this.eventApi.event.remove();
    this.dialogRef.close();
  }

  onAllDayCheckboxChange() {
    if (this.eventApi.event.allDay) {
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
