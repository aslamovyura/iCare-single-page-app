import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Profile } from '../_models'
import { AlertService, ProfileService, AuthenticationService, ReportService } from '../_services';

@Component({
    selector: 'patients-app',
    templateUrl: './patients.component.html'
})
export class PatientsComponent implements OnInit { 

    @ViewChild('readOnlyTemplate', {static: false}) readOnlyTemplate: TemplateRef<any>;

    patients: Profile[];
    isAdminMode: boolean;
    isLoading: boolean;

    constructor(
        private alertService: AlertService,
        private profileService: ProfileService,
        private authenticationService: AuthenticationService,
    ) {
        this.patients = new Array<Profile>();
        this.isAdminMode = false;
        this.isLoading = false;
    }

    // Actions on initialization.
    ngOnInit(): void {
        this.isAdminMode = this.authenticationService.getCurrentUserRole() == 'Admin' ? true : false;
        this.loadPatients();
    }

    // Load patients from server.
    loadPatients(): void {

        this.isLoading = true;

        if (this.isAdminMode) {
            this.profileService.getAll()
            .subscribe((data: Profile[]) => {
                    this.patients = data;
                },
                error => {
                    this.patients = null;
                    console.error(error);
                    this.alertService.error('Problems with server connection!');
                });
                this.isLoading = false;
        }
    }

    // Delete sensor.
    deletePatient(id: string) {
        this.isLoading = true;
        this.profileService.deleteById(id)
            .subscribe(
                data => {
                    this.loadPatients(),
                    this.alertService.success('Patients successfully removed!');
                    this.isLoading = false;
                },
                error => {
                    console.error(error);
                    this.alertService.error('Problems with patient removing...');
                    this.isLoading = false;
                }
            )
    }

    // Load appropriate page template.
    loadTemplate(patient: Profile) {
        return this.readOnlyTemplate;
    }
}