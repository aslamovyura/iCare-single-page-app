import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService, AuthenticationService, UserService } from '../_services';
import { User } from '../_models/user';

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
        private userService: UserService,
        private alertService: AlertService
    ) {
        if (this.authenticationService.currentUserValue) {
            this.router.navigate(['/']);
        }
    }

    ngOnInit() {
        this.registerForm = this.formBuilder.group({
            accountId:  ['00000000-0000-0000-0000-000000000000', null],
            firstName:  ['', [Validators.required]],
            lastName:   ['', [Validators.required]],
            middleName: ['', null],
            email:      ['', [Validators.required], Validators.email],
            password:   ['', [Validators.required]],
            role:       [1, null],
            isActive:   [true, null],
            username:   ['', [Validators.required]],
            birthDate:  ['', [Validators.required]],
            gender:     ['Male', null],
            weight:     [60, null],
            height:     [170, null]
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
        this.userService.registerAccount(this.registerForm.value)
            .subscribe(
                account => {
                    this.authenticationService.login(this.f.email.value, this.f.password.value)
                        .subscribe(
                            login => {
                                var user = this.registerForm.value;
                                user.accountId = (account as User).id;
                                this.userService.registerProfile(user)
                                    .subscribe(
                                        profile => {
                                            this.router.navigate(['/']);
                                        },
                                        error => {
                                            this.alertService.error(error);
                                            this.loading = false;
                                            this.authenticationService.logout();
                                        });
                            },
                            error => {
                                this.alertService.error(error);
                                this.loading = false;
                            });
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