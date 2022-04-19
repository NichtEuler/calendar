import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

import { AngularMaterialModule } from './angular-material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { CalendarComponent } from './calendar/calendar.component';
import { EventModalComponent } from './events/event-modal/event-modal.component';

import { ErrorInterceptor } from './message-interceptor';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthInterceptor } from './auth/auth-interceptor';
import { MainLandingComponent } from './mainLanding/mainLanding.component';

FullCalendarModule.registerPlugins([ // register FullCalendar plugins
  dayGridPlugin,
  interactionPlugin,
  timeGridPlugin
]);

@NgModule({
  declarations: [	
    AppComponent,
    HeaderComponent,
    CalendarComponent,
    EventModalComponent,
      MainLandingComponent
   ],
  imports: [
    AngularMaterialModule,
    MatSnackBarModule,
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    FullCalendarModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    MatSnackBarModule,
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
