import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { map, Observable, startWith, Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { EventModalComponent } from '../events/event-modal/event-modal.component';
import { Room } from '../rooms/room.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  constructor(private authService: AuthService, public dialog: MatDialog, private http: HttpClient, private router: Router) { }
  userIsAuthenticated = false;
  private authListenerSubscription: Subscription;
  roomname = new FormControl();
  filteredOptions: Observable<Room[]>;
  headerTitle = "MyCalendar";
  options: Room[] = [];

  ngOnInit(): void {
    this.getRooms();
  }
  ngOnDestroy(): void {
    this.authListenerSubscription.unsubscribe()
  }

  initForm() {
    this.userIsAuthenticated = this.authService.getIsAuthed();
    this.authListenerSubscription = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });

    this.filteredOptions = this.roomname.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value.name)),
      map(name => (name ? this._filter(name) : this.options.slice()))
    );
  }

  _filter(name: string): Room[] {
    const filterValue = name.toLowerCase();
    return this.options.filter(option => option.name.toLowerCase().includes(filterValue));
  }



  getRooms() {
    this.getData().subscribe(response => {
      this.options = response.rooms;
      this.initForm();
    })

  }

  //normalerweise vom service holen
  getData() {
    return this.http.get<{ message: string, rooms: any }>('http://localhost:3000/api/rooms')
      .pipe(
        map(roomData => {
          return {
            rooms: roomData.rooms.map(room => {
              return {
                id: room._id,
                name: room.name,
                location: room.location
              };
            }),
          };
        }
        ));
  }

  onCreateEventClick() {
    const dialogRef = this.dialog.open(EventModalComponent, {
      data: {
        event: { title: "Create Event", start: new Date(), end: new Date() }
      }
    });
  }

  onLogout() {
    this.authService.logout();
  }

  autoCompleteSelected(room: Room) {
    console.log(room.id);

    this.headerTitle = room.name;
    this.router.navigate([room.id]);
  }

  displayFn(room: Room): string {
    return room && room.name ? room.name : '';
  }
}
