import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Sensor } from '../_models';
import { SensorService, AlertService, ProfileService } from '../_services';
import { first } from 'rxjs/operators';

@Component({
    selector: 'sensors-app',
    templateUrl: './sensors.component.html'
})
export class SensorsComponent implements OnInit { 

    @ViewChild('readOnlyTemplate', {static: false}) readOnlyTemplate: TemplateRef<any>;
    @ViewChild('editTemplate', {static: false}) editTemplate: TemplateRef<any>;

    sensors: Sensor[];
    editedSensor: Sensor;
    isNewSensor: boolean;

    constructor(
        private sensorService: SensorService,
        private alertService: AlertService,
        private profileService: ProfileService,
    ) {
        this.sensors = new Array<Sensor>();
    }

    // Actions on initialization.
    ngOnInit(): void {
        this.loadSensors();
    }

    // Load sensors from server.
    loadSensors(): void {
        this.sensorService.getAll()
        .subscribe(
            (data: Sensor[]) => {
                this.sensors = data;
                console.log(data);
            },
            error => {
                this.sensors = null;
                console.error(error);
                this.alertService.error(error);
            }
        );
    }

    // Register new sensor.
    addSensor(): void {
        this.editedSensor = new Sensor();
        this.profileService.getCurrent().pipe(first()).subscribe(
            profile => {
                this.editedSensor.profileId = profile.id;

                console.log('profile ID:',this.editedSensor.profileId);
                this.sensors.push(this.editedSensor);
                this.isNewSensor = true;
            },
            error => {
                this.alertService.error(error);
                console.error(error);
            }
        );
    }

    // Edit existing sensor.
    editSensor(sensor: Sensor) {
        this.editedSensor = new Sensor();
        this.editedSensor.id = sensor.id;
        this.editedSensor.serial = sensor.serial;
        this.editedSensor.sensorType = sensor.sensorType;
        this.editedSensor.profileId = sensor.profileId;
        console.log(this.editedSensor);
    }

    // Delete sensor.
    deleteSensor(id: number) {
        console.log(id);
        this.sensorService.deleteById(id)
            .subscribe(
                data => {
                    this.loadSensors(),
                    this.alertService.success('Sensor successfully removed!');
                },
                error => {
                    console.error(error);
                    this.alertService.error('Problems with sensor removing...');
                }
            )
    }

    // Load appropriate template.
    loadTemplate(sensor: Sensor) {
        if (this.editedSensor && this.editedSensor.id === sensor.id) {
            return this.editTemplate;
        } else {
            return this.readOnlyTemplate;
        }
    }

    // Save new sensor.
    saveSensor() {

        console.log(this.editedSensor);
        if (this.isNewSensor) {
            // Add new sensor.
            this.sensorService.register(this.editedSensor)
                .subscribe(
                    data => {
                        this.loadSensors();
                        this.isNewSensor = false;
                        this.editedSensor = null;
                        this.alertService.success('Sensor successfully registered!');
                    },
                    error => {
                        this.alertService.error('Sensor registration error!');
                        this.cancel();
                    });
        } else {
            
            // Update existing sensor.
            this.sensorService.update(this.editedSensor)
                .subscribe(
                    data => {
                        this.loadSensors();
                        this.alertService.success('Sensor successfully updated!');
                    },
                    error => {
                        this.alertService.error('Sensor updating error!');
                        this.cancel();
                    });
            this.editedSensor = null;
        }
    }

    // Cancel sensor editing/registering.
    cancel() {
        // If cancel while registering new sensor, remove last sensor. 
        if (this.isNewSensor) {
            this.sensors.pop();
            this.isNewSensor = false;
        }
        this.editedSensor = null;
    }
}