import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Record } from '../_models';
import { SensorService } from './sensor.service';

@Injectable({ providedIn: 'root'})
export class RecordService {
    url: string;

    constructor(private http: HttpClient,
                private sensorService: SensorService) { 
        this.url = 'http://localhost:4001/api/records';
    }

    getAll() {
        return this.http.get<Record[]>(`${this.url}`);
    }

    getAllSensorRecords(sensorId: number) {
        return this.http.get<Record[]>(`${this.url}?sensorId=${sensorId}`);
    }

    // Get all records of current user.
    getAllOfCurrentUser(profileId: string) {
        if (profileId != null) {
            return new Promise( resolve => {
                this.sensorService.getAllOfCurrentUser(profileId)
                .subscribe(sensors => {

                    if (sensors.length == 0) {
                        resolve(null);
                    }
                    
                    let recordList = new Array<Record>();
                    for(const sensor of sensors) {

                        this.getAllSensorRecords(sensor.id)
                        .subscribe( records => {

                                for(let record of records) {                                    
                                    recordList.push(record);
                                };
                                resolve(recordList);
                            },
                            error => {
                                throw new Error(error);
                            }
                        );
                    };
                },
                error => {
                    throw new Error(error);
                });
            }) 
        } else {
            throw new Error('Profie ID is null!');
        }
    }   

    getById(id:number) {
        return this.http.get<Record>(`${this.url}/${id}`);
    }

    register(record: Record) {
        const myHeaders = new HttpHeaders().set('Content-Type', 'application/json');
        return this.http.post(`${this.url}`, JSON.stringify(record), { headers: myHeaders, responseType: 'json' });
    }

    update(record: Record) {
        const myHeaders = new HttpHeaders().set('Content-Type', 'application/json');
        return this.http.put(`${this.url}/${record.id}`, JSON.stringify(record), { headers: myHeaders, responseType: 'json' });
    }

    deleteById(id:number) {
        return this.http.delete<Record>(`${this.url}/${id}`);
    }
}


