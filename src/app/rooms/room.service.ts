import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Room } from './room.model';


const BACKEND_URL = environment.apiUrl + "/rooms";
@Injectable({
  providedIn: 'root'
})
export class RoomService {

  constructor(private http: HttpClient) { }


  async getRoom(roomId: string) {
    return this.http.get<{ message: string, room: Room }>(BACKEND_URL + "/" + roomId)
      .pipe(map(response => response.room));
  }
}
