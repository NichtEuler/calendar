import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { map } from 'rxjs';
import { EventModalComponent } from '../events/event-modal/event-modal.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(public dialog: MatDialog, private http: HttpClient, private fb: FormBuilder) { }
  myControl = new FormControl();
  filteredOptions;
  formGroup: FormGroup;
  options = ["Sam", "Varun", "Jasmine"];

  ngOnInit(): void {
    this.initForm();
    this.getNames();
  }

  initForm() {
    this.formGroup = this.fb.group({
      'roomname': ['']
    })
    this.formGroup.get('roomname').valueChanges.subscribe(response => {
      console.log('data is ', response);
      this.filterData(response);
    })
  }
  filterData(enteredData) {
    this.filteredOptions = this.options.filter(item => {
      return item.toLowerCase().indexOf(enteredData.toLowerCase()) > -1
    })
  }


  getNames() {
    this.getData().subscribe(response => {
      this.options = response;
      this.filteredOptions = response;
    })
  }

  getData() {
    return this.http.get<any>('https://jsonplaceholder.typicode.com/users')
      .pipe(
        map((response: []) => response.map(item => item['name']))
      )
  }

  onCreateEventClick() {
    const dialogRef = this.dialog.open(EventModalComponent, {
      data: { title: "Create Event" }
    });
  }

}
