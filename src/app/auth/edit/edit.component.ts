import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HeaderTitleService } from 'src/app/header/headertitle.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  constructor(private authService: AuthService, private headerTitleService: HeaderTitleService) { }

  isLoading = false;
  ngOnInit() {
    this.headerTitleService.updateHeaderTitle("Edit user");
  }

  onEdit(form: NgForm) {
    if (form.invalid) {
      return;
    }
    console.log(form.value.newPassword);

    this.authService.editUser(form.value.email, form.value.username, form.value.password, this.authService.getUserId(), form.value.newPassword);
    this.isLoading = true;
  }
}
