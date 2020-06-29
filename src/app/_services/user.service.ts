import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { User } from '../_models';

@Injectable({ providedIn: 'root'})
export class UserService {
    profileUrl: string;
    accountUrl: string;

    constructor(private http: HttpClient) { 
        this.profileUrl = 'http://localhost:4003/api/profiles';
        this.accountUrl = 'http://localhost:4004/api/accounts';
    }

    getAll() {
        return this.http.get<User[]>(`${this.profileUrl}`);
    }

    getById(id:string) {
        return this.http.get<User>(`${this.profileUrl}/${id}`);
    }

    registerAccount(user: User) {
        const myHeaders = new HttpHeaders().set('Content-Type', 'application/json');
        return this.http.post(`${this.accountUrl}/register`, JSON.stringify(user), { headers: myHeaders })
    }

    registerProfile(user: User) {
        const myHeaders = new HttpHeaders().set('Content-Type', 'application/json');
        return this.http.post(`${this.profileUrl}`, JSON.stringify(user), { headers: myHeaders });
    }
}