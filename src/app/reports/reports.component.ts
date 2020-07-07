import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Report } from '../_models'
import { AlertService, ProfileService, AuthenticationService, RecordService, ReportService } from '../_services';
import { Subscription } from 'rxjs';
import { ActivatedRoute} from '@angular/router';

@Component({
    selector: 'reports-app',
    templateUrl: './reports.component.html'
})
export class ReportsComponent implements OnInit { 

    @ViewChild('readOnlyTemplate', {static: false}) readOnlyTemplate: TemplateRef<any>;
    @ViewChild('editTemplate', {static: false}) editTemplate: TemplateRef<any>;

    reports: Report[];
    isAdminMode: boolean;
    isLoading: boolean;
    recordId: number;

    private querySubscription: Subscription;

    constructor(
        private recordService: RecordService,
        private alertService: AlertService,
        private profileService: ProfileService,
        private authenticationService: AuthenticationService,
        private reportService: ReportService,
        private route: ActivatedRoute, 
    ) {
        this.reports = new Array<Report>();
        this.isAdminMode = false;
        this.isLoading = false;

        this.querySubscription = this.route.queryParams.subscribe(
            (queryParam: any) => {
                this.recordId = queryParam['recordId'];
            }
        );
    }

    // Actions on initialization.
    ngOnInit(): void {
        this.isAdminMode = this.authenticationService.getCurrentUserRole() == 'Admin' ? true : false;
        this.loadReports();
    }

    // Load reports from server.
    loadReports(): void {

        this.isLoading = true;

        if (this.isAdminMode) {
            this.loadAllReports();
            this.isLoading = false;

        } else if(this.recordId != null) {
            this.loadAllRecordReports(this.recordId);
            this.isLoading = false;

        } else {
            this.profileService.getCurrent()
            .subscribe(
                profile => {
                    this.loadReportsOfCurrentUser(profile.id);
                    this.isLoading = false;
                },
                error => {
                    this.alertService.error('Report loading issues!');
                    this.isLoading = false;
                });
        }
    }

    // Load all registered reports.
    private loadAllReports() {
        this.reportService.getAll()
        .subscribe(
            (data: Report[]) => {
                this.reports = data;
            },
            error => {
                this.reports = null;
                console.error(error);
                this.alertService.error('Problems with server connection!');
            });
    }

    // Load records only for current user.
    private loadReportsOfCurrentUser(profileId: string) {
        this.reportService.getAllOfCurrentUser(profileId)
        .then((reportList: Report[]) => {
            this.reports = reportList;
        })
        .catch(error => {
            console.error(error);
            this.alertService.error('Problems with server connection!');
        });
    }

    // Load reports only for the specific record.
    private loadAllRecordReports(recordId: number) {
        this.reportService.getRecordReport(recordId)
        .subscribe(
            (data: Report[]) => {
                this.reports = data;
            },
            error => {
                this.reports = null;
                console.error(error);
                this.alertService.error('Problems with server connection!');
            });
    }

    // Delete sensor.
    deleteReport(id: number) {
        this.isLoading = true;
        this.reportService.deleteById(id)
            .subscribe(
                data => {
                    this.loadReports(),
                    this.alertService.success('Report successfully removed!');
                    this.isLoading = false;
                },
                error => {
                    console.error(error);
                    this.alertService.error('Problems with report removing...');
                    this.isLoading = false;
                }
            )
    }

    // Load appropriate page template.
    loadTemplate(report: Report) {
        return this.readOnlyTemplate;
    }
}