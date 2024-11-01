import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, NgForm, Validators } from '@angular/forms';
import { HeaderTitleService } from 'src/app/header/headertitle.service';
import { AuthService } from '../auth.service';
import { checkPasswords, MyErrorStateMatcher } from '../MyErrorStateMatcher';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {


  isLoading = false;
  editUserForm: UntypedFormGroup;
  hideOld = true;
  hideMain = true;
  hideRep = true;
  matcher = new MyErrorStateMatcher("notSame");

  constructor(private authService: AuthService, private headerTitleService: HeaderTitleService, private formBuilder: UntypedFormBuilder) {
    this.editUserForm = this.formBuilder.group({
      username: ['', [Validators.minLength(5), Validators.maxLength(12), Validators.pattern("^[a-zA-Z0-9_]*$")]],
      email: ['', [Validators.required, Validators.email]],
      oldPassword: ['', [Validators.required]],
      password: ['', [Validators.minLength(8)]],
      confirmPassword: ['']
    }, { validator: checkPasswords });
  }

  ngOnInit() {
    this.headerTitleService.updateHeaderTitle("Edit user");
  }

  onEdit(form: UntypedFormGroup) {
    if (form.invalid) {
      return;
    }

    this.authService.editUser(form.value.email, form.value.username, form.value.oldPassword, this.authService.getUserId(), form.value.password);
    this.isLoading = true;
  }
}
