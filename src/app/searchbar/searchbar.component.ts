import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { map, Observable, startWith } from 'rxjs';
import { Room } from '../rooms/room.model';
import { HeaderTitleService } from '../header/headertitle.service';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.css']
})
export class SearchbarComponent implements OnInit {

  constructor(private http: HttpClient, private router: Router, private roomService: HeaderTitleService) { }

  roomname = new FormControl();
  filteredOptions: Observable<Room[]>;
  options: Room[] = [];

  ngOnInit() {
    this.getRooms();
  }

  initForm() {
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
  autoCompleteSelected(room: Room) {
    this.router.navigate([room.id]);
    this.roomService.updateHeaderTitle(room.name);
  }

  displayFn(room: Room): string {
    return room && room.name ? room.name : '';
  }
}
