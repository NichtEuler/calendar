import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { HeaderTitleService } from '../header/headertitle.service';

@Component({
  selector: 'app-mainLanding',
  templateUrl: './mainLanding.component.html',
  styleUrls: ['./mainLanding.component.css']
})
export class MainLandingComponent implements OnInit {

  constructor(private headerTitleService: HeaderTitleService, private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.headerTitleService.updateHeaderTitle("MyCalendar");
    if (!this.authService.getIsAuthed()) {
      this.router.navigate(["/auth/login"]);
    }
  }

}
