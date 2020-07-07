import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Report } from '../_models';
import { SensorService, RecordService } from '../_services';

@Injectable({ providedIn: 'root'})
export class ReportService {
    url: string;

    constructor(
        private http: HttpClient,
        private sensorService: SensorService,
        private recordService: RecordService,
    ) { 
        this.url = 'http://localhost:4002/api/reports';
    }

    // Get all data processing reports.
    getAll() {
        return this.http.get<Report[]>(`${this.url}`);
    }

    // Get all reports of a specific data record.
    getRecordReport(recordId: number) {
        return this.http.get<Report[]>(`${this.url}?recordId=${recordId}`);
    }

    // Get all reports of current user.
    getAllOfCurrentUser(profileId: string) {
        if (profileId != null) {
            console.log('profile ID:', profileId);
            return new Promise( resolve => {
                this.sensorService.getAllOfCurrentUser(profileId).subscribe(sensors => {

                    console.log('Sensors:', sensors);
                    let reportsList = new Array<Report>();
                    for(const sensor of sensors) {

                        this.recordService.getAllSensorRecords(sensor.id).subscribe( records => {

                                console.log('Records:', records);
                                for(let record of records) {        

                                    console.log('Single Record:', record);
                                    this.getRecordReport(record.id).subscribe( reports => {

                                            console.log('_Reports:', reports);
                                            if (reports != null) {
                                                // Add last report.
                                                console.log('_Single Report:', reports[0]);
                                                reportsList.push(reports[0]); 
                                            }
                                        },
                                        error => {
                                            console.error('Report Error', error);
                                            throw new Error(error);
                                        })                            
                                };
                                resolve(reportsList);
                            },
                            error => {
                                console.error('Records Error', error);
                                throw new Error(error);
                            });
                    };
                },
                error => {
                    console.error('Sensors Error', error);
                    throw new Error(error);
                });
            }) 
        } else {
            throw new Error('Profie ID is null!');
        }
    }   

    getById(id:number) {
        return this.http.get<Report>(`${this.url}/${id}`);
    }

    register(report: Report) {
        const myHeaders = new HttpHeaders().set('Content-Type', 'application/json');
        return this.http.post(`${this.url}`, JSON.stringify(report), { headers: myHeaders, responseType: 'json' });
    }

    update(report: Report) {
        const myHeaders = new HttpHeaders().set('Content-Type', 'application/json');
        return this.http.put(`${this.url}/${report.id}`, JSON.stringify(report), { headers: myHeaders, responseType: 'json' });
    }

    deleteById(id:number) {
        return this.http.delete<Report>(`${this.url}/${id}`);
    }
}