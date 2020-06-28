import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, AuthenticationService } from '../_services';

@Component({
    selector: 'login-app',
    templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService
    ){
        // If already logged in, redirect to home page.
        if (this.authenticationService.currentUserValue){
            this.router.navigate(['/']);
        } 
    }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            email: ['', Validators.required],
            password: ['', Validators.required]
        });

        // Get return URL from route parameters or default redirect to home page('/').
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    // Getter to access the form fields.
    get f() { 
        return this.loginForm.controls;
    }

    onSubmit() {
        this.submitted = true;

        // Check login form. If it is invalid, return to login page.
        if (this.loginForm.invalid)
        {
            return;
        }

        this.loading = true;
        this.authenticationService.login(this.f.email.value, this.f.password.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.router.navigate([this.returnUrl])
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }
 }