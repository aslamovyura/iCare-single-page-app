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

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(email: string, password: string) {
        const myHeaders = new HttpHeaders().set('Content-Type', 'application/json');
        //myHeaders.append('Access-Control-Allow-Origin', 'http://localhost:4004');
        //myHeaders.append('Access-Control-Allow-Credentials', 'true');
        return this.http.post<any>('http://localhost:4004/api/accounts/login', JSON.stringify({ email, password }), { headers: myHeaders })
            .pipe(map(user => {

                // Login successful if there's a jwt token in the response.
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