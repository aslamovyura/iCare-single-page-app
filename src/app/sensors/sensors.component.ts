import { Component, OnInit } from '@angular/core';
import { Sensor } from '../_models';
import { SensorService, AlertService } from '../_services';

@Component({
    selector: 'sensors-app',
    templateUrl: './sensors.component.html'
})
export class SensorsComponent implements OnInit { 
    sensorList: Sensor[];

    constructor(
        private sensorService: SensorService,
        private alertService: AlertService,
    ) {
        this.sensorList = new Array<Sensor>();
    }

    ngOnInit(): void {
        this.loadSensors();
    }

    // Load sensors from server.
    loadSensors(): void {
        this.sensorService.getAll()
        .subscribe(
            data => {
                this.sensorList = data;
                console.log(data);
            },
            error => {
                this.sensorList = null;
                console.error(error);
                this.alertService.error(error);
            }
        );
    }
}