import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { HeaderTitleService } from 'src/app/header/headertitle.service';

import { AuthService } from '../auth.service';
import { checkPasswords, MyErrorStateMatcher } from '../MyErrorStateMatcher';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  isLoading = false;
  hideMain = true;
  hideRep = true;
  signupForm: UntypedFormGroup;
  matcher = new MyErrorStateMatcher("notSame");
  private authStatusSub: Subscription;

  constructor(private authService: AuthService, private headerTitleService: HeaderTitleService, private formBuilder: UntypedFormBuilder) {
    this.signupForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(12), Validators.pattern("^[a-zA-Z0-9_]*$")]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['']
    }, { validator: checkPasswords });
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }

  ngOnInit(): void {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
    this.headerTitleService.updateHeaderTitle("Sign Up")
  }

  onSignup(form: UntypedFormGroup) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.createUser(form.value.email, form.value.username, form.value.password);
  }

}