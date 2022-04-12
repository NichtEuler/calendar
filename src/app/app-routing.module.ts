import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalendarComponent } from './calendar/calendar.component';

const routes: Routes = [
  { path: ":roomId", component: CalendarComponent },
  { path: "auth", loadChildren: () => import("./auth/auth.module").then(m => m.AuthModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
