import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Profile } from '../_models';
import { AuthenticationService } from './authentication.service';
import { first } from 'rxjs/operators';

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
        console.log(profile);
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

    getCurrentProfileId() : string {
        let id = this.getCurrentAccountId();
        let profileId;
        this.http.get<Profile>(`${this.profileUrl}/accountId/${id}`)
            .pipe(first())
            .subscribe(
                data => {
                    profileId = data.id;
                },
                error => {
                    profileId = null;
                }
            );
        return profileId;
    }
}