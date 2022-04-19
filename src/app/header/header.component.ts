import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { RoomService } from './headertitle.service';

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
  public route: ActivatedRoute;

  ngOnInit(): void {
    this.userIsAuthenticated = this.authService.getIsAuthed();
    this.authListenerSubscription = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });
    this.roomnameUpdatedListener = this.roomService.getHeaderTitleUpdatedListener()
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
