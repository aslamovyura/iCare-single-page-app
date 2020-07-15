import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { HealthCheck  } from '../_models'
import { AlertService, HealthCheckService, AuthenticationService } from '../_services';
import { AppConstants } from '../_constants/app-constants';

@Component({
    selector: 'health-check-app',
    templateUrl: './health-check.component.html'
})
export class HealthCheckComponent implements OnInit { 

    @ViewChild('readOnlyTemplate', {static: false}) readOnlyTemplate: TemplateRef<any>;

    healthChecks: HealthCheck[];
    isAdminMode: boolean;
    isLoading: boolean;
    sensorId: number;
    imgSrc: string;

    constructor(
        private alertService: AlertService,
        private healthCheckService: HealthCheckService,
        private authenticationService: AuthenticationService,
    ) {
        this.healthChecks = new Array<HealthCheck>();
        this.isAdminMode = false;
        this.isLoading = false;
        this.imgSrc = AppConstants.LOADING_GIF;
    }

    // Actions on initialization.
    ngOnInit(): void {
        this.isAdminMode = this.authenticationService.getCurrentUserRole() == 'Admin' ? true : false;
        this.doHealthCheck();
    }

    // Check services health.
    doHealthCheck(): void {
        if (this.isAdminMode) {
            this.isLoading = true;

            this.healthCheckService.doServicesHealthCheck()
            .then((healthChecks: Array<HealthCheck>) => {
                this.healthChecks = healthChecks;
                this.isLoading = false;
            }).catch(error => {
                this.alertService.error(error);
                this.isLoading = false;
            })
        }
    }

    // Load appropriate template.
    loadTemplate() {
        return this.readOnlyTemplate;
    }

    // Convert heath check result to color.
    convertStatusToColor(healthStatus: string) : string{
        let color;
        switch(healthStatus) {
            case 'Healthy':
                color = 'green';
                break;
            case 'Unhealthy':
                color = 'red';
                break;
        }
        return color;
    }
}