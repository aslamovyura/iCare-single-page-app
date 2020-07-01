import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Profile } from '../_models';
import { AuthenticationService } from './authentication.service';

@Injectable({ providedIn: 'root'})
export class ProfileService {
    profileUrl: string;

    constructor(private http: HttpClient, 
                private authenticationService: AuthenticationService) { 
        this.profileUrl = 'http://localhost:4003/api/profiles';
    }

    getCurrent() {

        let id = this.getCurrentAccountId();
        return this.http.get<Profile>(`${this.profileUrl}/accountId/${id}`);
    }

    getAll() {
        return this.http.get<Profile[]>(`${this.profileUrl}`);
    }

    getById(id:string) {
        return this.http.get<Profile>(`${this.profileUrl}/${id}`);
    }

    register(profile: Profile) {
        profile.accountId = this.getCurrentAccountId();
        const myHeaders = new HttpHeaders().set('Content-Type', 'application/json');
        return this.http.post(`${this.profileUrl}`, JSON.stringify(profile), { headers: myHeaders, responseType: 'json' });
    }

    update(profile: Profile) {
        profile.accountId = this.getCurrentAccountId();
        const myHeaders = new HttpHeaders().set('Content-Type', 'application/json');
        return this.http.put(`${this.profileUrl}/${profile.id}`, JSON.stringify(profile), { headers: myHeaders, responseType: 'json' });
    }

    deleteById(id:string) {
        return this.http.delete<Profile>(`${this.profileUrl}/${id}`);
    }

    getCurrentAccountId() : string {
        let currentUser = this.authenticationService.currentUserValue;
        if (currentUser == null) {
            return null;
        }

        return currentUser.id;
    }
}