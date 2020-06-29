import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService, AuthenticationService, UserService } from '../_services';
import { first } from 'rxjs/operators';

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
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            middleName: ['', null],
            email: ['', Validators.required, Validators.email],
            role: [1, null],
            username: ['', Validators.required],
            password: ['', Validators.required, Validators.maxLength(6)],
            birthDate: [Date.parse('1984/01/01'), Validators.required],
            gender: ['Male', Validators.required],
            passport: ['', Validators.required],
            weight: [60, Validators.required],
            height: [170, Validators.required]
        });
    }

    // Getter for easy access to register form fields.
    get f() { return this.registerForm.controls; }

    onSubmit() {
        this.submitted = true;

        if (this.registerForm.invalid){
            return;
        }

        this.loading = true;
        console.log(this.registerForm.value);
        this.userService.registerAccount(this.registerForm.value)
            .pipe(first())
            .subscribe(
                data => {
                    console.log('Account registered successfully');
                    this.alertService.success('Account registered successfully', true);
                    this.authenticationService.login(this.f.email.value, this.f.password.value)
                        .pipe(first())
                        .subscribe(
                            data => {
                                console.log('Login successful');
                                this.userService.registerProfile(this.registerForm.value)
                                .pipe(first())
                                .subscribe(
                                    data => {
                                        console.log('Profile created successfully!');
                                        this.alertService.success('Profile created successfully!', false);
                                        this.router.navigate(['/']);
                                    },
                                    error => {
                                        console.error(`Profile creation error ${error.message}`);
                                        this.alertService.error(error);
                                        this.loading = false;
                                    });
                            },
                            error => {
                                console.error('Login error');
                                this.alertService.error(error);
                                this.loading = false;
                            });
                },
                error => {
                    console.error('Account registration error');
                    this.alertService.error(error);
                    this.loading = false;
                }
            )
    }
}