import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ProfileService, AlertService } from '../_services';
import { Profile } from '../_models';
import { AppConstants } from '../_constants/app-constants';

@Component({
    selector: 'profile-app',
    templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit{ 
    profileForm: FormGroup;
    loading = false;
    isExist = false;
    imgSrc: string;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private profileService: ProfileService,
        private alertService: AlertService,
    ) { 
        this.profileForm = new FormGroup({
            firstName: new FormControl(),
            lastName: new FormControl(),
            middleName: new FormControl(),
            birthDate: new FormControl(),
            gender: new FormControl(),
            weight: new FormControl(),
            height: new FormControl(),
         });
        this.imgSrc = AppConstants.LOADING_GIF;
    }

    // Actions on initialization.
    ngOnInit() {
        this.profileService.getCurrent()
        .then ((profile: Profile) => {
            if (profile == null) { 
                this.router.navigate(['/profile/edit']);
            }
            else {
                this.fillProfileForm(profile);
                this.isExist = true;
            }})
        .catch(error => {
                console.error(error);
                this.alertService.error(AppConstants.CONNECTION_ISSUES, true);
                this.router.navigate(['/']);
            }
        );
    }

    // Getter for easy access to register form fields.
    get f() { return this.profileForm.controls; }

    fillProfileForm(data: Profile) {

        if (data != null) {
            this.profileForm = this.formBuilder.group({
                firstName:  [ data.firstName, null],
                lastName:   [ data.lastName, null],
                middleName: [ data.middleName, null],
                birthDate:  [ data.birthDate.toString().substr(0,10), null],
                gender:     [ data.gender, null],
                weight:     [ data.weight, null],
                height:     [ data.height, null]
            });
        }
        else {
            this.profileForm = this.formBuilder.group({
                firstName:  [ '', null],
                lastName:   [ '', null],
                middleName: [ '', null],
                birthDate:  [ 'undefined', null],
                gender:     [ 'undefined', null],
                weight:     [ 'undefined', null],
                height:     [ 'undefined', null]
            });
        }
    }
}