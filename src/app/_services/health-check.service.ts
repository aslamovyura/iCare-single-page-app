import { UrlConstants } from '../_constants';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HealthCheck } from '../_models'

@Injectable({ providedIn: 'root'})
export class HealthCheckService {
    healthChecks: HealthCheck[];

    constructor(
        private http: HttpClient,

    ) {
        this.healthChecks = [
            {service: 'Gateway API', url: UrlConstants.GATEWAY_API_HC_URL, status: null},
            {service: 'Sensor API', url: UrlConstants.SENSOR_API_HC_URL, status: null},
            {service: 'Report API', url: UrlConstants.REPORT_API_HC_URL, status: null},
            {service: 'Profile API', url: UrlConstants.PROFILE_API_HC_URL, status: null},
            {service: 'Identity API', url: UrlConstants.IDENTITY_API_HC_URL, status: null},
            {service: 'DataProcessor #1 API', url: UrlConstants.DATAPROCESSOR_1_API_HC_URL, status: null},
            {service: 'DataProcessor #2 API', url: UrlConstants.DATAPROCESSOR_2_API_HC_URL, status: null},
            {service: 'DataSource #1 API', url: UrlConstants.DATASOURCE_1_API_HC_URL, status: null},
            {service: 'DataSource #1 API', url: UrlConstants.DATASOURCE_2_API_HC_URL, status: null},
        ];
    }

    // Check health of all services.
    doServicesHealthCheck() {
        return new Promise( resolve => {

            for (const hc of this.healthChecks){
                this.getHealthCheckStatus(hc)
                .then((status: string) => {
                    console.log('healthCheck:', status);
                    hc.status = status;
                    console.log(`${hc.service} -- ${hc.status}`)
                }).catch(error => {
                    console.error(error);
                });
            };
            resolve(this.healthChecks);
        });
    }

    // Get service health check.
    async getHealthCheckStatus(hc: HealthCheck) : Promise<string>{
        return new Promise( resolve => {

            // TODO: choose another solution.
            this.http.get<string>(`${hc.url}`)
            .subscribe(
                data => {},
                error => {
                    if (error == 'OK'){
                        resolve('Healthy');
                    } else {
                        console.log(`${hc.url}`);
                        console.error('Unhealthy reason:', error);
                        resolve('Unhealthy');
                    }
                });
        });
    } 
}