import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Report } from '../_models'
import { AlertService, ProfileService, AuthenticationService, ReportService } from '../_services';
import { Subscription } from 'rxjs';
import { ActivatedRoute} from '@angular/router';

@Component({
    selector: 'reports-app',
    templateUrl: './reports.component.html'
})
export class ReportsComponent implements OnInit { 

    @ViewChild('readOnlyTemplate', {static: false}) readOnlyTemplate: TemplateRef<any>;

    reports: Report[];
    isAdminMode: boolean;
    isLoading: boolean;
    recordId: number;
    patientId: string;

    private querySubscription: Subscription;

    constructor(
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
                this.patientId = queryParam['patientId'];
            }
        );
    }

    // Return reports, sorted by date (descending).
    public get sortedReports() : Report[] {
        return this.reports.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    // Actions on initialization.
    ngOnInit(): void {
        this.isAdminMode = this.authenticationService.getCurrentUserRole() == 'Admin' ? true : false;
        this.loadReports();
    }

    // Load reports from server.
    loadReports(): void {
        this.isLoading = true;

        if (this.isAdminMode && this.recordId == null && this.patientId == null) {
            this.loadAllReports();

        } else if(this.recordId != null ) {
            this.loadAllRecordReports(this.recordId);
        
        } else if(this.patientId != null ) {
            this.loadAllPatientReports(this.patientId);

        } else {
            this.profileService.getCurrent()
            .subscribe(
                profile => {
                    this.loadAllPatientReports(profile.id);
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
                this.isLoading = false;
            },
            error => {
                this.reports = null;
                console.error(error);
                this.alertService.error('Problems with server connection!');
                this.isLoading = false;
            });
    }

    // Load records only for current user.
    private loadAllPatientReports(profileId: string) {
        this.reportService.getAllProfileReports(profileId)
        .then((reportList: Report[]) => {
            this.reports = reportList;
            this.isLoading = false;
        })
        .catch(error => {
            console.error(error);
            this.alertService.error('Problems with server connection!');
            this.isLoading = false;
        });
    }

    // Load reports only for the specific record.
    private loadAllRecordReports(recordId: number) {
        this.reportService.getRecordReport(recordId)
        .subscribe(
            (data: Report[]) => {
                this.reports = data;
                this.isLoading = false;
            },
            error => {
                this.reports = null;
                console.error(error);
                this.alertService.error('Problems with server connection!');
                this.isLoading = false;
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

    // Conver heath status to color.
    convertStatusToColor(healthStatus: string) : string{
        let color;
        switch(healthStatus) {
            case 'Healthy':
                color = 'green';
                break;
            case 'Unknown':
                color = 'yellow';
                break;
            case 'Diseased':
                color = 'red';
                break;
        }
        return color;
    }
}