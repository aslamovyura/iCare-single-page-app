import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Sensor } from '../_models';
import { SensorService, AlertService, ProfileService, AuthenticationService } from '../_services';
import { first } from 'rxjs/operators';
import { AppConstants } from '../_constants/app-constants';

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
    isAdminMode: boolean;
    isLoading: boolean;
    imgSrc: string;

    constructor(
        private sensorService: SensorService,
        private alertService: AlertService,
        private profileService: ProfileService,
        private authenticationService: AuthenticationService,
    ) {
        this.sensors = new Array<Sensor>();
        this.isAdminMode = false;
        this.isLoading = false;
        this.imgSrc = AppConstants.LOADING_GIF;
    }

    // Actions on initialization.
    ngOnInit(): void {
        this.isAdminMode = this.authenticationService.getCurrentUserRole() == 'Admin' ? true : false;
        this.loadSensors();
    }

    // Load sensors from server.
    loadSensors(): void {

        this.isLoading = true;

        if (this.isAdminMode) {
            this.loadAllSensors();
        } else {
            this.profileService.getCurrent()
            .subscribe(
                profile => {
                    this.loadSensorsOfCurrentUser(profile.id);
                },
                error => {
                    this.alertService.error(AppConstants.LOAD_SENSORS_FAIL);
                    this.isLoading = false;
                });
        }
    }

    // Load all registered sensor. 
    private loadAllSensors() {
        this.sensorService.getAll()
        .subscribe(
            (data: Sensor[]) => {
                this.sensors = data;
                this.isLoading = false;
            },
            error => {
                this.sensors = null;
                console.error(error);
                this.alertService.error(AppConstants.CONNECTION_ISSUES);
                this.isLoading = false;
            }
        );
    }

    // Load sensors only for current user.
    private loadSensorsOfCurrentUser(profileId: string) {
        this.sensorService.getAllOfCurrentUser(profileId)
        .subscribe(
            (data: Sensor[]) => {
                this.sensors = data;
                this.isLoading = false;
            },
            error => {
                this.sensors = null;
                console.error(error);
                this.alertService.error(AppConstants.CONNECTION_ISSUES);
                this.isLoading = false;
            }
        );
    }

    // Register new sensor.
    addSensor(): void {
        this.editedSensor = new Sensor();
        this.profileService.getCurrent().pipe(first()).subscribe(
            profile => {

                this.editedSensor.profileId = profile.id;

                this.sensors.push(this.editedSensor);
                this.isNewSensor = true;
            },
            error => {
                console.error(error);
                this.alertService.error(AppConstants.REGISTER_SENSOR_FAIL);
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
    }

    // Delete sensor.
    deleteSensor(id: number) {
        this.isLoading = true;
        this.sensorService.deleteById(id)
            .subscribe(
                data => {
                    this.loadSensors(),
                    this.alertService.success(AppConstants.REMOVE_SENSOR_SUCCESS);
                    this.isLoading = false;
                },
                error => {
                    console.error(error);
                    this.alertService.error(AppConstants.REMOVE_SENSOR_FAIL);
                    this.isLoading = false;
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

        this.isLoading = true;
        if (this.isNewSensor) {
            // Add new sensor.
            this.sensorService.register(this.editedSensor)
                .subscribe(
                    data => {
                        this.loadSensors();
                        this.isNewSensor = false;
                        this.editedSensor = null;
                        this.alertService.success(AppConstants.REGISTER_SENSOR_SUCCESS);
                        this.isLoading = false;
                    },
                    error => {
                        this.alertService.error(AppConstants.REGISTER_SENSOR_FAIL);
                        this.cancel();
                        this.isLoading = false;
                    });
        } else {
            
            // Update existing sensor.
            this.sensorService.update(this.editedSensor)
                .subscribe(
                    data => {
                        this.loadSensors();
                        this.alertService.success(AppConstants.UPDATE_SENSOR_SUCCESS);
                        this.isLoading = false;
                    },
                    error => {
                        this.alertService.error(AppConstants.UPDATE_SENSOR_FAIL);
                        this.cancel();
                        this.isLoading = false;
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