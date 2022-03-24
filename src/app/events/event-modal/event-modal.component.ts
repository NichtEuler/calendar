import { Time } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CalendarEvent } from '../calendarEvent.model';
import { CalendarEventService } from '../calendarEvent.service';
import { Subscription } from "rxjs";


@Component({
  selector: 'app-event-modal',
  templateUrl: './event-modal.component.html',
  styleUrls: ['./event-modal.component.css']
})
export class EventModalComponent implements OnInit {

  form: FormGroup;
  calendarEventSub: Subscription;


  constructor(
    public calendarEventService: CalendarEventService,
    public dialogRef: MatDialogRef<EventModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CalendarEvent,
  ) { }



  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl(null, { validators: [Validators.required, Validators.minLength(3)] }),
      date: new FormControl(null, { validators: [Validators.required] }),
      startTime: new FormControl(null, { validators: [Validators.required] }),
      endTime: new FormControl({ value: "", disabled: this.data.allDay }),
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
    console.log(this.data)
    if (this.data.isExisting) {
      console.log("isexisting")
      this.calendarEventService.updateCalendarEvent();
    } else {
      console.log("notexisting")
      this.calendarEventService.addCalendarEvent();
    }
    this.form.reset();
  }

  onDeleteEvent() {
    this.calendarEventService.deleteCalendarEvent(this.data.id);
  }

  onAllDayCheckboxChange() {
    if (this.data.allDay) {
      this.form.controls["startTime"].disable()
      this.form.controls["endTime"].disable()
    }
    else {
      this.form.controls["startTime"].enable()
      this.form.controls["endTime"].enable()
    }
  }
}
