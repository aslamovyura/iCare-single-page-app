import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService, ProfileService } from '../_services';
import { Profile } from '../_models';
import { first } from 'rxjs/operators';
import { DatePipe } from '@angular/common'

@Component({
    selector: 'edit-profile-app',
    templateUrl: './edit-profile.component.html'
})
export class EditProfileComponent implements OnInit { 
    editProfileForm: FormGroup;
    loading = false;
    submitted = false;
    operation: string;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private profileService: ProfileService,
        private alertService: AlertService,
        public datepipe: DatePipe
    ) 
    {
        this.editProfileForm = new FormGroup({
            firstName: new FormControl(),
            lastName: new FormControl(),
            middleName: new FormControl(),
            birthDate: new FormControl(),
            gender: new FormControl(),
            weight: new FormControl(),
            height: new FormControl(),
         });
    }

    ngOnInit() {
        
        this.profileService.getCurrent()
        .pipe(first())
        .subscribe (
            data => {                
                if (data == null) {
                    this.operation ='Create';
                    console.log('Create');
                    this.fillEditProfileForm(null);
                }
                else {
                    this.operation ='Update';
                    console.log('Update');
                    this.fillEditProfileForm(data);
                }
            },
            error => {
                this.alertService.error('Problems with connection to Profile service!');
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
        this.profileService.getCurrent()
            .subscribe(
                profile => {
                    if (this.operation == 'Update') {
                        var newProfile = this.editProfileForm.value as Profile;
                        newProfile.id = profile.id;
                        this.profileService.update(newProfile)
                        .subscribe(
                            profile => {
                                console.log('Profile successfully updated!');
                                this.router.navigate(['profile']);
                                this.loading = false;
                            },
                            error => {
                                console.error(error);
                                this.alertService.error(error);
                                this.loading = false;
                            });
                    } else {
                        this.profileService.register(this.editProfileForm.value)
                        .subscribe(
                            profile => {
                                console.log('Profile successfully registered!');
                                this.router.navigate(['profile']);
                                this.loading = false;
                            },
                            error => {
                                console.error(error);
                                this.alertService.error(error);
                                this.loading = false;
                            });
                    }
                },
                error => {
                    console.error(error);
                    this.alertService.error(error);
                    this.loading = false;
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
                firstName:  [ data.firstName, [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
                lastName:   [ data.lastName, [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
                middleName: [ data.middleName, null],
                birthDate:  [ this.datepipe.transform(data.birthDate, 'yyyy-MM-dd'), [Validators.required]],
                gender:     [ data.gender, [Validators.required]],
                weight:     [ data.weight, [Validators.required, Validators.min(20), Validators.max(250)]],
                height:     [ data.height, [Validators.required, Validators.min(40), Validators.max(250)]]
            });
        } 
        else {
            this.editProfileForm = this.formBuilder.group({
                firstName:  [ '', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
                lastName:   [ '', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
                middleName: [ '', null],
                birthDate:  [ '', [Validators.required]],
                gender:     [ '', [Validators.required]],
                weight:     [ '', [Validators.required, Validators.min(20), Validators.max(200)]],
                height:     [ '', [Validators.required, Validators.min(40), Validators.max(250)]]
            });
        }
    }
}