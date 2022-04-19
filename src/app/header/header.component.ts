import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { RoomService } from '../rooms/room.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  constructor(private authService: AuthService, private roomService: RoomService) { }
  userIsAuthenticated = false;
  private authListenerSubscription: Subscription;
  private roomnameUpdatedListener: Subscription;
  headerTitle = "MyCalendar";

  ngOnInit(): void {
    this.userIsAuthenticated = this.authService.getIsAuthed();
    this.authListenerSubscription = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });
    this.roomnameUpdatedListener = this.roomService.getRoomnameUpdatedListener()
      .subscribe(roomname => {
        this.headerTitle = roomname;
      });

  }
  ngOnDestroy(): void {
    this.authListenerSubscription.unsubscribe();
  }

  onLogout() {
    this.authService.logout();
  }

  headerClick() {
    this.headerTitle = "MyCalendar"
  }
}
