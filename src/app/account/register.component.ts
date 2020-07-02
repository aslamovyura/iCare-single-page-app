import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService, AuthenticationService, AccountService } from '../_services';

@Component({
    selector: 'register-app',
    templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit{ 
    registerForm: FormGroup;
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private authenticationService: AuthenticationService,
        private accountService: AccountService,
        private alertService: AlertService
    ) {
        if (this.authenticationService.currentUserValue) {
            this.router.navigate(['/']);
        }
    }

    ngOnInit() {
        this.registerForm = this.formBuilder.group({
            username:   ['', [Validators.required]],
            email:      ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
            password:   ['', [Validators.required]],
            role:       [1, null],
            isActive:   [true, null],
        });
    }

    // Getter for easy access to register form fields.
    get f() { return this.registerForm.controls; }

    // Submit registration form.
    onSubmit() {
        this.submitted = true;

        if (this.isInvalidRegisterForm()){
            return;
        }

        this.loading = true;
        this.accountService.register(this.registerForm.value)
            .subscribe(
                account => {
                    this.alertService.success('Registration successful', true);
                    this.router.navigate(['/login']);
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            )
    }

    // Check validity of registration form.
    public isInvalidRegisterForm() : boolean {
        let invalid = [];
        let controls = this.registerForm.controls;
        for (const name in controls) {
            if (controls[name].invalid) {
                invalid.push(name);
            }
        }
        let isValid = invalid.length > 0;
        return isValid;
    }
}