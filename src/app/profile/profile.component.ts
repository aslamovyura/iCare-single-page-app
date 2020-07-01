import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProfileService } from '../_services';
import { first } from 'rxjs/operators';
import { Profile } from '../_models';

@Component({
    selector: 'profile-app',
    templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit{ 
    profileForm: FormGroup;
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private profileService: ProfileService,
    ) { }

    ngOnInit() {

        console.log('On init!');
         this.profileService.getCurrent()
        .pipe(first())
        .subscribe (
            data => {
                this.fillProfileForm(data);
            },
            error => {
                console.error(error);
                this.fillProfileForm(null);
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
                birthDate:  [ data.birthDate, null],
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