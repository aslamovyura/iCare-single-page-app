import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Record, Profile } from '../_models'
import { AlertService, ProfileService, AuthenticationService } from '../_services';
import { RecordService } from '../_services/record.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute} from '@angular/router';
import { AppConstants } from '../_constants/app-constants';

@Component({
    selector: 'records-app',
    templateUrl: './records.component.html'
})
export class RecordsComponent implements OnInit { 

    @ViewChild('readOnlyTemplate', {static: false}) readOnlyTemplate: TemplateRef<any>;

    records: Record[];
    isAdminMode: boolean;
    isLoading: boolean;
    sensorId: number;
    imgSrc: string;

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

        this.querySubscription = this.route.queryParams.subscribe(
            (queryParam: any) => {
                this.sensorId = queryParam['sensorId'];
            }
        );
        this.imgSrc = AppConstants.LOADING_GIF;
    }

    // Actions on initialization.
    ngOnInit(): void {
        this.isAdminMode = this.authenticationService.getCurrentUserRole() == 'Admin' ? true : false;
        this.loadRecords();
    }

    // Return records, sorted by date (descending).
    public get sortedRecords() : Record[] {
        if (this.records == null) {
            return null;
        } else {
            return this.records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        }
    }

    // Load records from server.
    loadRecords(): void {

        this.isLoading = true;
        console.log(this.isLoading);
        if (this.isAdminMode && this.sensorId == null) {
            this.loadAllRecords();

        } else if(this.sensorId != null) {
            this.loadAllSensorRecords(this.sensorId);

        } else {
            this.profileService.getCurrent().then((profile: Profile) => {
                console.log('profileId:', profile.id);
                this.loadRecordsOfCurrentUser(profile.id);
            }).catch(error => {
                this.alertService.error(AppConstants.LOAD_RECORDS_FAIL);
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
                this.isLoading = false;
                console.log('All', this.isLoading);
            },
            error => {
                this.records = null;
                console.error(error);
                this.alertService.error(AppConstants.CONNECTION_ISSUES);
                this.isLoading = false;
                console.log(this.isLoading);
            });
    }

    // Load records only for current user.
    private loadRecordsOfCurrentUser(profileId: string) {
        this.recordService.getAllOfCurrentUser(profileId)
        .then((recordList: Record[]) => {
            this.records = recordList;
            this.isLoading = false;
        })
        .catch(error => {
            console.error(error);
            this.alertService.error(AppConstants.CONNECTION_ISSUES);
            this.isLoading = false;
            console.log('currentUser', this.isLoading);
        });
    }

    // Load records only for the specific sensor.
    private loadAllSensorRecords(sensorId: number) {
        this.recordService.getAllSensorRecords(sensorId)
        .subscribe(
            (data: Record[]) => {
                this.records = data;
                this.isLoading = false;
                console.log('AllSensorRecords', this.isLoading);
            },
            error => {
                this.records = null;
                console.error(error);
                this.alertService.error(AppConstants.CONNECTION_ISSUES);
                this.isLoading = false;
                console.log(this.isLoading);
            });
    }

    // Delete sensor.
    deleteRecord(id: number) {
        this.isLoading = true;
        this.recordService.deleteById(id)
            .subscribe(
                data => {
                    this.loadRecords(),
                    this.alertService.success(AppConstants.REMOVE_RECORD_SUCCESS);
                    this.isLoading = false;
                },
                error => {
                    console.error(error);
                    this.alertService.error(AppConstants.REMOVE_RECORD_FAIL);
                    this.isLoading = false;
                }
            )
    }

    // Load appropriate template.
    loadTemplate(record: Record) {
        return this.readOnlyTemplate;
    }
}