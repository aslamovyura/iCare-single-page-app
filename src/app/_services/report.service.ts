import { UrlConstants } from '../_constants';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Report } from '../_models';
import { SensorService } from './sensor.service';
import { RecordService } from './record.service';

@Injectable({ providedIn: 'root'})
export class ReportService {
    url: string;

    constructor(
        private http: HttpClient,
        private sensorService: SensorService,
        private recordService: RecordService,
    ) { 
        this.url = UrlConstants.REPORTS_URL;
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
    getAllProfileReports(profileId: string) {
        if (profileId != null) {
            return new Promise( resolve => {
                this.sensorService.getAllOfCurrentUser(profileId).subscribe(sensors => {
                    if (sensors.length == 0) {
                        resolve(null);
                    }
                    
                    let reportsList = new Array<Report>();
                    for(const sensor of sensors) {
                        this.recordService.getAllSensorRecords(sensor.id).subscribe( records => {

                                for(let record of records) {        
                                    this.getRecordReport(record.id).subscribe( reports => {
                                        if (reports != null && reports.length > 0) {
                                            // Add last report.
                                            reportsList.push(reports[0]); 
                                        }
                                    },
                                    error => {
                                        throw new Error(error);
                                    })                            
                                };
                                resolve(reportsList);
                            },
                            error => {
                                throw new Error(error);
                            });
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