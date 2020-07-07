import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Record } from '../_models'
import { AlertService, ProfileService, AuthenticationService } from '../_services';
import { RecordService } from '../_services/record.service';
import { first } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { ActivatedRoute} from '@angular/router';

@Component({
    selector: 'records-app',
    templateUrl: './records.component.html'
})
export class RecordsComponent implements OnInit { 

    @ViewChild('readOnlyTemplate', {static: false}) readOnlyTemplate: TemplateRef<any>;
    @ViewChild('editTemplate', {static: false}) editTemplate: TemplateRef<any>;

    records: Record[];
    isAdminMode: boolean;
    isLoading: boolean;
    sensorId: number;

    private querySubscription: Subscription;

    constructor(
        private recordService: RecordService,
        private alertService: AlertService,
        private profileService: ProfileService,
        private authenticationService: AuthenticationService,
        private route: ActivatedRoute, 
    ) {
        this.records = new Array<Record>();
        this.isAdminMode = false;
        this.isLoading = false;

        this.querySubscription = route.queryParams.subscribe(
            (queryParam: any) => {
                this.sensorId = queryParam['sensorId'];
            }
        );
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

        } else if(this.sensorId != null) {
            this.loadAllSensorRecords(this.sensorId);
            this.isLoading = false;

        } else {
            this.profileService.getCurrent()
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
                this.alertService.error('Problems with server connection!');
            });
    }

    // Load records only for current user.
    private loadRecordsOfCurrentUser(profileId: string) {
        this.recordService.getAllOfCurrentUser(profileId)
        .then((recordList: Record[]) => {
            this.records = recordList;
        })
        .catch(error => {
            console.error(error);
            this.alertService.error('Problems with server connection!');
        });
    }

    // Load records only for the specific sensor.
    private loadAllSensorRecords(sensorId: number) {
        this.recordService.getAllSensorRecords(sensorId)
        .subscribe(
            (data: Record[]) => {
                this.records = data;
            },
            error => {
                this.records = null;
                console.error(error);
                this.alertService.error('Problems with server connection!');
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
        return this.readOnlyTemplate;
    }
}