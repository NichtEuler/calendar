import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EventModalComponent } from '../events/event-modal/event-modal.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(public dialog: MatDialog) { }
  animal: "string";
  name: "string";

  ngOnInit(): void {
  }


  onCreateEventClick() {
    const dialogRef = this.dialog.open(EventModalComponent, {
      data: { name: this.name, animal: this.animal, title: "Create Event" }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
    });
  }

}
