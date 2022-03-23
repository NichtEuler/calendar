import { Time } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  title: string;
  date: Date;
  startTime: Time;
  endTime: Time;
  allDay: boolean;
  isExisting: boolean;
}

@Component({
  selector: 'app-event-modal',
  templateUrl: './event-modal.component.html',
  styleUrls: ['./event-modal.component.css']
})
export class EventModalComponent implements OnInit {

  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EventModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl(null, { validators: [Validators.required, Validators.minLength(3)] }),
      date: new FormControl(null, { validators: [Validators.required] }),
      startTime: new FormControl(null, { validators: [Validators.required] }),
      endTime: new FormControl(null),
      allDay: new FormControl(null)
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
}
