import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { CalendarComponent } from './calendar/calendar.component';
import { MainLandingComponent } from './mainLanding/mainLanding.component';

const routes: Routes = [
  { path: "", component: MainLandingComponent },
  { path: ":roomId", component: CalendarComponent, canActivate: [AuthGuard] },
  { path: "auth", loadChildren: () => import("./auth/auth.module").then(m => m.AuthModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
