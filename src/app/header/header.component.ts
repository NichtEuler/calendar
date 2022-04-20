import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { HeaderTitleService } from './headertitle.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  constructor(private authService: AuthService, private roomService: HeaderTitleService) { }

  userIsAuthenticated = false;
  private authListenerSubscription: Subscription;
  private userNameSubscription: Subscription;
  private headerTitleUpdateListener: Subscription;
  userName: string;
  headerTitle = "MyCalendar";

  ngOnInit(): void {
    this.userIsAuthenticated = this.authService.getIsAuthed();
    this.authListenerSubscription = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });
    this.headerTitleUpdateListener = this.roomService.getHeaderTitleUpdatedListener()
      .subscribe(roomname => {
        this.headerTitle = roomname;
      });

    this.userNameSubscription = this.authService.getuserNameListener()
      .subscribe(username => this.userName = username);

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
  onManageAccount() {
    alert("Not implemented")
  }
}
