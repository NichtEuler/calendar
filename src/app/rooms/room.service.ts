import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  constructor() { }
  private roomNameUpdated = new Subject<string>();

  updateRoomname(roomname: string) {
    this.roomNameUpdated.next(roomname);
  }

  getRoomnameUpdatedListener() {
    return this.roomNameUpdated.asObservable();
  }

}
