import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService, ProfileService } from '../_services';
import { Profile } from '../_models';
import { DatePipe } from '@angular/common'
import { AppConstants } from '../_constants/app-constants';
import { AuthenticationService } from '../_services/authentication.service';

@Component({
    selector: 'edit-profile-app',
    templateUrl: './edit-profile.component.html'
})
export class EditProfileComponent implements OnInit { 
    editProfileForm: FormGroup;
    loading = false;
    submitted = false;
    operation: string;
    imgSrc: string;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private profileService: ProfileService,
        private alertService: AlertService,
        private authenticationService: AuthenticationService,
        public datepipe: DatePipe,
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
         this.imgSrc = AppConstants.LOADING_GIF;
    }

    // Actions on initialization
    ngOnInit() {
        this.profileService.getCurrent()
        .then((profile: Profile) => {             
            if (profile == null) {
                this.operation ='Create';
                console.log('Create');
                this.fillEditProfileForm(null);
            }
            else {
                this.operation ='Update';
                console.log('Update');
                this.fillEditProfileForm(profile);
            }})
        .catch(error => {
            this.alertService.error(AppConstants.CONNECTION_ISSUES);
        });
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
            .then( (profile: Profile) => {
                if (this.operation == 'Update') {
                    var newProfile = this.editProfileForm.value as Profile;
                    newProfile.id = profile.id;
                    this.profileService.update(newProfile)
                    .subscribe(
                        data => {
                            console.log(AppConstants.UPDATE_PROFILE_SUCCESS);
                            this.alertService.success(AppConstants.UPDATE_PROFILE_SUCCESS, true)
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
                            console.log(AppConstants.CREATE_PROFILE_SUCCESS);
                            this.alertService.success(AppConstants.CREATE_PROFILE_SUCCESS);
                            this.router.navigate(['profile']);
                            this.loading = false;
                        },
                        error => {
                            console.error(error);
                            this.alertService.error(error);
                            this.loading = false;
                        });
                }
            }).catch(error => {
                console.error(error);
                this.alertService.error(error);
                this.loading = false;
            })
    }

    // Delete current user (account + profile).
    onDelete() {
        this.profileService.getCurrent()
        .then((profile: Profile) => {
            this.profileService.deleteById(profile.id)
                .subscribe(
                    data => {
                        this.authenticationService.logout();
                        this.router.navigate(['/']);
                        location.reload(true);
                    },
                    error => {
                        console.error(error);
                        this.alertService.error(error);
                    }
                )
        })
        .catch(error => {
            console.error(error);
            this.alertService.error(error);
        })
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