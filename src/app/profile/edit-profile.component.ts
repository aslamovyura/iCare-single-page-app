import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService, AuthenticationService ,ProfileService } from '../_services';
import { Profile } from '../_models';
import { first } from 'rxjs/operators';

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
        private profileService: ProfileService,
        private authenticationService: AuthenticationService,
        private alertService: AlertService
    ) { }

    ngOnInit() {
        
        this.profileService.getCurrent()
        .pipe(first())
        .subscribe (
            data => {
                this.fillEditProfileForm(data);
            },
            error => {
                console.error(error);
                this.fillEditProfileForm(null);
            }
        );
    }

    // Getter for easy access to register form fields.
    get f() { return this.editProfileForm.controls; }

    // Submit registration form.
    onSubmit() {
        this.submitted = true;

        if (this.isInvalidEditProfileForm()){
            return;
        }

        this.loading = true;

        console.log('Getting current...');
        this.profileService.getCurrent()
            .subscribe(
                profile => {
                        console.log('Updating...');
                        var newProfile = this.editProfileForm.value as Profile;
                        newProfile.id = profile.id;
                        console.log(newProfile);
                        this.profileService.update(newProfile)
                        .subscribe(
                            profile => {
                                console.log(profile);
                                console.log('Profile successfully updated!');
                                this.router.navigate(['profile']);
                            },
                            error => {
                                console.error(error);
                                this.alertService.error(error);
                                this.loading = false;
                            });
                },
                error => {
                    console.log(error);
                    console.log('Registering...');
                        this.profileService.register(this.editProfileForm.value)
                        .subscribe(
                            profile => {
                                console.log(profile);
                                console.log('Profile successfully registered!');
                                this.router.navigate(['profile']);
                            },
                            error => {
                                console.error(error);
                                this.alertService.error(error);
                                this.loading = false;
                            });
                }
            );
    }

    // Check validity of edit profile form.
    public isInvalidEditProfileForm() : boolean {
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

    // Fill edit profile form with data.
    fillEditProfileForm(data: Profile) {

        if (data != null) {
            this.editProfileForm = this.formBuilder.group({
                firstName:  [ data.firstName, null],
                lastName:   [ data.lastName, null],
                middleName: [ data.middleName, null],
                birthDate:  [ data.birthDate, null],
                gender:     [ data.gender, null],
                weight:     [ data.weight, null],
                height:     [ data.height, null]
            });
        } 
        else {
            this.editProfileForm = this.formBuilder.group({
                firstName:  [ '', null],
                lastName:   [ '', null],
                middleName: [ '', null],
                birthDate:  [ '', null],
                gender:     [ '', null],
                weight:     [ '', null],
                height:     [ '', null]
            });
        }
    }
}