import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  constructor() { }
  private headerTitleUpdated = new Subject<string>();

  updateHeaderTitle(headerTitle: string) {
    this.headerTitleUpdated.next(headerTitle);
  }

  getHeaderTitleUpdatedListener() {
    return this.headerTitleUpdated.asObservable();
  }

}
