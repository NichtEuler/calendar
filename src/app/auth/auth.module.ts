import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { AngularMaterialModule } from "../angular-material.module";
import { EditComponent } from "./edit/edit.component";
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AuthRoutingModule } from "./auth-routing.module";


@NgModule({
    declarations: [
        LoginComponent,
        SignupComponent,
        EditComponent
    ],
    imports: [
        AngularMaterialModule,
        CommonModule,
        FormsModule,
        AuthRoutingModule
    ]
})

export class AuthModule { }