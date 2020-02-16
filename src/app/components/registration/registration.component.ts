import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { RegistrationService } from 'src/app/services/registration.service';
import { UserReg } from 'src/app/models/userReg';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CanComponentDeactivate } from 'src/app/services/can-deactivate-guard.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})

export class RegistrationComponent implements OnInit, CanComponentDeactivate {
  registrationForm: FormGroup;
  errorMessage: string = null;
  successfulReg: boolean = false;
  success: string = null;
  user: UserReg;

  constructor(
    private registrationService: RegistrationService,
    private router: Router,
    private flashMessage: FlashMessagesService, private toastr: ToastrService
  ) { }


  ngOnInit() {

    this.registrationForm = new FormGroup({
      'firstName': new FormControl('', Validators.required),
      'lastName': new FormControl('', Validators.required),
      'email': new FormControl('', [Validators.required, Validators.email]),
      'password': new FormControl('', [Validators.required, Validators.minLength(6)]),
      'passwordRepeat': new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  onSubmit() {
    if (this.registrationForm.invalid) {
      this.errorMessage = "Please enter a valid data.";
      this.toastr.error(  this.errorMessage, 'Registration');
      return;
    }
    
    if (!(this.registrationForm.value.password === this.registrationForm.value.passwordRepeat)) {
      this.errorMessage = "Password must match in both fields.";
      this.toastr.error(  this.errorMessage, 'Registration');
      return;
    }

    const user = new UserReg(this.registrationForm.value.firstName,
      this.registrationForm.value.lastName,
      this.registrationForm.value.email,
      this.registrationForm.value.password);

    this.registrationService.register(user).subscribe(
      responseData => {
        this.errorMessage = null;
        this.successfulReg = true;
        this.registrationForm.reset();
        this.success = "You need to verify your account. Please check your email.";
      },
      message => {
        if (message.status == 200) {
          this.errorMessage = null;
          this.successfulReg = true;
          this.registrationForm.reset();
          this.success = "You need to verify your account. Please check your email.";
          this.flashMessage.show("You need to verify your account. Please check your email.", { cssClass: 'alert-success' });
        } else {
          this.errorMessage = message.error;
          this.toastr.error(  this.errorMessage, 'Registration');
        }

      }
    );

  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.successfulReg &&
      (this.registrationForm.value.firstName !== '' ||
        this.registrationForm.value.lastName !== '' || this.registrationForm.value.email !== ''
        || this.registrationForm.value.password !== '' || this.registrationForm.value.passwordRepeat !== '')) {
      return confirm('Are you sure you want to cancel registration?');
    } else {
      return true;
    }
  }

  login() {
    this.router.navigate(['/login']);
  }
}