import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
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
import { MatSnackBarModule as MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthInterceptor } from './auth/auth-interceptor';
import { MainLandingComponent } from './mainLanding/mainLanding.component';
import { SearchbarComponent } from './searchbar/searchbar.component';



@NgModule({ declarations: [
        AppComponent,
        HeaderComponent,
        CalendarComponent,
        EventModalComponent,
        MainLandingComponent,
        SearchbarComponent
    ],
    bootstrap: [AppComponent], imports: [AngularMaterialModule,
        MatSnackBarModule,
        AppRoutingModule,
        BrowserModule,
        BrowserAnimationsModule,
        FullCalendarModule,
        FormsModule], providers: [
        MatSnackBarModule,
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        provideHttpClient(withInterceptorsFromDi())
    ] })
export class AppModule { }
