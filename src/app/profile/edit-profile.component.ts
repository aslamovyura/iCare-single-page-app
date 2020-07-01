import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService, AuthenticationService, ProfileService } from '../_services';

@Component({
    selector: 'edit-profile-app',
    templateUrl: './edit-profile.component.html'
})
export class EditProfileComponent implements OnInit{ 
    editProfileForm: FormGroup;
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private authenticationService: AuthenticationService,
        private profileService: ProfileService,
        private alertService: AlertService
    ) { }

    ngOnInit() {
        this.editProfileForm = this.formBuilder.group({
            accountId:  ['00000000-0000-0000-0000-000000000000', null],
            firstName:  ['', [Validators.required]],
            lastName:   ['', [Validators.required]],
            middleName: ['', null],
            birthDate:  ['', [Validators.required]],
            gender:     ['Male', null],
            weight:     [60, null],
            height:     [170, null]
        });
    }

    // Getter for easy access to register form fields.
    get f() { return this.editProfileForm.controls; }

    // Submit registration form.
    onSubmit() {
        this.submitted = true;

        if (this.isInvalidEditForm()){
            return;
        }

        this.loading = true;

        this.profileService.register(this.editProfileForm.value)
            .subscribe(
                profile => {
                    this.router.navigate(['profile']);
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                    this.authenticationService.logout();
                });
    }

    // Check validity of edit profile form.
    public isInvalidEditForm() : boolean {
        let invalid = [];
        let controls = this.editProfileForm.controls;
        for (const name in controls) {
            if (controls[name].invalid) {
                invalid.push(name);
            }
        }
        let isValid = invalid.length > 0;
        return isValid;
    }
}