import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Profile } from '../_models';

@Injectable({ providedIn: 'root'})
export class ProfileService {
    profileUrl: string;

    constructor(private http: HttpClient) { 
        this.profileUrl = 'http://localhost:4003/api/profiles';
    }

    getCurrent() {

        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        console.log(currentUser);

        if (currentUser == null) {
            return null;
        }

        let id = currentUser.id;
        console.log(id);

        return this.http.get<Profile>(`${this.profileUrl}/accountId/${id}`);
    }

    getAll() {
        return this.http.get<Profile[]>(`${this.profileUrl}`);
    }

    getById(id:string) {
        return this.http.get<Profile>(`${this.profileUrl}/${id}`);
    }

    register(profile: Profile) {

        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser == null) {
            return;
        }

        console.log(currentUser);
        profile.accountId = currentUser.id;

        console.log(profile);
        const myHeaders = new HttpHeaders().set('Content-Type', 'application/json');
        return this.http.post(`${this.profileUrl}/register`, JSON.stringify(profile), { headers: myHeaders, responseType: 'json' });
    }

    update(profile: Profile) {
        const myHeaders = new HttpHeaders().set('Content-Type', 'application/json');
        return this.http.post(`${this.profileUrl}`, JSON.stringify(profile), { headers: myHeaders, responseType: 'json' });
    }

    deleteById(id:string) {
        return this.http.delete<Profile>(`${this.profileUrl}/${id}`);
    }
}