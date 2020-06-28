import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../_models';

@Injectable({ providedIn: 'root'})
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(private http: HttpClient){
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    // Getter for easy access to current user in local storage.
    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(email: string, password: string) {

        const url = 'http://localhost:4004/api/accounts/login';
        const myHeaders = new HttpHeaders().set('Content-Type', 'application/json');

        return this.http.post<any>(url, JSON.stringify({ email, password }), { headers: myHeaders })
            .pipe(map(user => {

                // Login is successful, if there's a jwt token in the response.
                if(user && user.token) {
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    this.currentUserSubject.next(user);
                }
                return user;
            }));
    }

    logout() {

        // Clean local storage.
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }
}