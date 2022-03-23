import { Time } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EventModel } from '../event.model';


@Component({
  selector: 'app-event-modal',
  templateUrl: './event-modal.component.html',
  styleUrls: ['./event-modal.component.css']
})
export class EventModalComponent implements OnInit {

  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EventModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EventModel,
  ) { }



  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl(null, { validators: [Validators.required, Validators.minLength(3)] }),
      date: new FormControl(null, { validators: [Validators.required] }),
      startTime: new FormControl(null, { validators: [Validators.required] }),
      endTime: new FormControl({ value: "", disabled: this.data.allDay }),
      allDay: new FormControl(null, { validators: [Validators.required] })
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSaveEvent() {

    if (this.form.invalid) {
      return;
    }
    console.log(this.form.value)
    this.dialogRef.close();
  }

  onDeleteEvent() {

  }

  onCheckboxChange() {
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
