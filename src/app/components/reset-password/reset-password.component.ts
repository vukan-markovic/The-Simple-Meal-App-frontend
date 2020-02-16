import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  errorMessage: string = null;
  token: string;

  constructor(private route: ActivatedRoute, private userService: UsersService, private flashMessage: FlashMessagesService, 
    private router: Router,private toastr: ToastrService) { }

  ngOnInit() {
    this.resetPasswordForm = new FormGroup({
      'password': new FormControl('', [Validators.required, Validators.minLength(6)]),
      'passwordRepeat': new FormControl('', [Validators.required, Validators.minLength(6)])
    });

    this.route.queryParams.subscribe(
      (queyParams: Params) => {
        this.token = queyParams['token'];  
        if (this.token == null) this.router.navigate(['/']);
      }
    );
  }

  onSubmit() {
    if (this.resetPasswordForm.invalid) {
      this.errorMessage = "Please enter a valid data.";
      this.toastr.error(  this.errorMessage, 'Reset password');
      return;
    }

    if (!(this.resetPasswordForm.value.password === this.resetPasswordForm.value.passwordRepeat)) {
      this.errorMessage = "Password must match in both fields.";
      this.toastr.error(  this.errorMessage, 'Reset password');
      return;
    }

    this.userService.updatePassword(this.resetPasswordForm.value.password, this.token).subscribe(
      data => {
        this.toastr.success(data,'Reset password');
        this.router.navigate(['/login']);
      }, message => {
        if (message.status != 200)   this.toastr.error( message.error, 'Reset password');
      }
    );
  }
}