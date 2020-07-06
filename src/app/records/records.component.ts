import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Record } from '../_models'
import { AlertService, ProfileService, AuthenticationService } from '../_services';
import { RecordService } from '../_services/record.service';
import { first } from 'rxjs/operators';

@Component({
    selector: 'records-app',
    templateUrl: './records.component.html'
})
export class RecordsComponent implements OnInit { 

    @ViewChild('readOnlyTemplate', {static: false}) readOnlyTemplate: TemplateRef<any>;
    @ViewChild('editTemplate', {static: false}) editTemplate: TemplateRef<any>;

    records: Record[];
    editedRecord: Record;
    isNewRecord: boolean;
    isAdminMode: boolean;
    isLoading: boolean;

    constructor(
        private recordService: RecordService,
        private alertService: AlertService,
        private profileService: ProfileService,
        private authenticationService: AuthenticationService,
    ) {
        this.records = new Array<Record>();
        this.isAdminMode = false;
        this.isLoading = false;
    }

    // Actions on initialization.
    ngOnInit(): void {
        this.isAdminMode = this.authenticationService.getCurrentUserRole() == 'Admin' ? true : false;
        this.loadRecords();
    }

    // Load records from server.
    loadRecords(): void {

        this.isLoading = true;

        if (this.isAdminMode) {
            this.loadAllRecords();
            this.isLoading = false;
        } else {
            this.profileService.getCurrent().pipe(first())
            .subscribe(
                profile => {
                    this.loadRecordsOfCurrentUser(profile.id);
                    this.isLoading = false;
                },
                error => {
                    this.alertService.error('Record loading issues!');
                    this.isLoading = false;
                });
        }
    }

    // Load all registered records.
    private loadAllRecords() {
        this.recordService.getAll()
        .subscribe(
            (data: Record[]) => {
                this.records = data;
            },
            error => {
                this.records = null;
                console.error(error);
                this.alertService.error(error);
            }
        );
    }

    // Load records only for current user.
    private loadRecordsOfCurrentUser(profileId: string) {
        this.recordService.getAllOfCurrentUser(profileId)
        .then((recordList: Record[]) => {
            this.records = recordList;
        });
    }
    
    // Delete sensor.
    deleteRecord(id: number) {
        this.isLoading = true;
        this.recordService.deleteById(id)
            .subscribe(
                data => {
                    this.loadRecords(),
                    this.alertService.success('Record successfully removed!');
                    this.isLoading = false;
                },
                error => {
                    console.error(error);
                    this.alertService.error('Problems with record removing...');
                    this.isLoading = false;
                }
            )
    }

    // Load appropriate template.
    loadTemplate(record: Record) {
        if (this.editedRecord && this.editedRecord.id === record.id) {
            return this.editTemplate; // deleted.
        } else {
            return this.readOnlyTemplate;
        }
    }
}