import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../../services/authentication.service';
import { MessagingService } from 'src/app/services/messaging.service';
import { RegistrationService } from 'src/app/services/registration.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    templateUrl: 'login.component.html',
    styleUrls: ['login.component.css']
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    submitted = false;
    error = '';
    token: string;
    constructor(
        private formBuilder: FormBuilder,
        private authenticationService: AuthenticationService,
        @Inject(MessagingService) private msgService: MessagingService,
        private router: Router, private route: ActivatedRoute,
        private registrationService: RegistrationService, private toastr: ToastrService
    ) {
        // redirect to home if already logged in
        if (this.authenticationService.currentUserValue) {
            this.router.navigate(['/']);
        }
    }

    ngOnInit() {
        if (this.authenticationService.isLoggedIn()) this.router.navigate(['/']);

        this.loginForm = this.formBuilder.group({
            email: ['', Validators.required],
            password: ['', Validators.required]
        });

        // get return url from route parameters or default to '/'
        // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.route.queryParams.subscribe(
            (queyParams: Params) => {
                this.token = queyParams['token'];
                if (this.token != undefined) {
                    this.registrationService.sendToken(this.token);
                }
            }
        );
    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        // this.loading = true;
        this.authenticationService.login(this.f.email.value, this.f.password.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.router.navigate(['/']);
                    this.msgService.getPermission();
                    this.msgService.receiveMessage();
                },
                error => {
                    this.error = "Please verify your account or check email address and password. ";
                    this.toastr.error(this.error, 'Add menu');
                });;
    }

    register() {
        this.router.navigate(['/register']);
    }

    resetPassword() {
        this.router.navigate(['/email'])
    }
}