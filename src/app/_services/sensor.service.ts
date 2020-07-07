import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Sensor } from '../_models';

@Injectable({ providedIn: 'root'})
export class SensorService {
    url: string;

    constructor(private http: HttpClient) { 
        this.url = 'http://localhost:4001/api/sensors';
    }

    getAll() {
        return this.http.get<Sensor[]>(`${this.url}`);
    }

    getAllOfCurrentUser(profileId: string) {
        if (profileId != null) {
            return this.http.get<Sensor[]>(`${this.url}/${profileId}`);
        } else {
            throw new Error('Unknown profile!');
        }
    }   

    getById(id:number) {
        return this.http.get<Sensor>(`${this.url}/${id}`);
    }

    register(sensor: Sensor) {
        const myHeaders = new HttpHeaders().set('Content-Type', 'application/json');
        return this.http.post(`${this.url}`, JSON.stringify(sensor), { headers: myHeaders, responseType: 'json' });
    }

    update(sensor: Sensor) {
        const myHeaders = new HttpHeaders().set('Content-Type', 'application/json');
        return this.http.put(`${this.url}/${sensor.id}`, JSON.stringify(sensor), { headers: myHeaders, responseType: 'json' });
    }

    deleteById(id:number) {
        return this.http.delete<Sensor>(`${this.url}/${id}`);
    }
}