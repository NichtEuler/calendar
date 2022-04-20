import { Component, OnInit } from '@angular/core';
import { HeaderTitleService } from '../header/headertitle.service';

@Component({
  selector: 'app-mainLanding',
  templateUrl: './mainLanding.component.html',
  styleUrls: ['./mainLanding.component.css']
})
export class MainLandingComponent implements OnInit {

  constructor(private headerTitleService: HeaderTitleService) { }

  ngOnInit() {
    this.headerTitleService.updateHeaderTitle("MyCalendar")
  }

}
