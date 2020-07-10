import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Profile } from '../_models';
import { AuthenticationService } from './authentication.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root'})
export class ProfileService {
    profileUrl: string;
    needUpdate: boolean;
    private currentProfileSubject: BehaviorSubject<Profile>;

    constructor(private http: HttpClient, 
                private authenticationService: AuthenticationService) { 
        this.profileUrl = 'http://localhost:4003/api/profiles';
        this.currentProfileSubject = new BehaviorSubject<Profile>(JSON.parse(localStorage.getItem('profile')));
        this.needUpdate = true;
    }

    // Get current profile.
    getCurrent() {
        return new Promise((resolve, reject) => {
            if (this.currentProfileSubject.value != null && this.needUpdate != true) {
                resolve(this.currentProfileSubject.value);
            } else {
                let accountId = this.getCurrentAccountId();
                this.http.get<Profile>(`${this.profileUrl}/accountId/${accountId}`)
                    .subscribe(
                        profile => {
                            if(profile && profile.id) {
                                localStorage.setItem('profile', JSON.stringify(profile));
                                this.currentProfileSubject.next(profile);
                            }
                            this.needUpdate = false;
                            resolve(profile);
                        },
                        error => resolve(null)
                    )};
            })
        }

    // Get all registered profiles.
    getAll() {
        return this.http.get<Profile[]>(`${this.profileUrl}`);
    }

    // Get profile by Id.
    getById(id:string) {
        return this.http.get<Profile>(`${this.profileUrl}/${id}`);
    }

    // Register new profle
    register(profile: Profile) {
        profile.accountId = this.getCurrentAccountId();
        const myHeaders = new HttpHeaders().set('Content-Type', 'application/json');
        return this.http.post(`${this.profileUrl}`, JSON.stringify(profile), { headers: myHeaders, responseType: 'json' });
    }

    // Update profile info.
    update(profile: Profile) {
        this.needUpdate = true;
        console.log('need update: ', this.needUpdate);
        profile.accountId = this.getCurrentAccountId();
        const myHeaders = new HttpHeaders().set('Content-Type', 'application/json');
        return this.http.put(`${this.profileUrl}/${profile.id}`, JSON.stringify(profile), { headers: myHeaders, responseType: 'json' });
    }

    // Delete profile by Id.
    deleteById(id:string) {
        return this.http.delete<Profile>(`${this.profileUrl}/${id}`);
    }

    // Get Id of the current account.
    getCurrentAccountId(): string {
        let currentUser = this.authenticationService.currentUserValue;
        if (currentUser == null) {
            return null;
        }
        return currentUser.id;
    }
}