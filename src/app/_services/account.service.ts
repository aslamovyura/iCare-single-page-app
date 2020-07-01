import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

@Injectable({ providedIn: 'root'})
export class AccountService {
    // profileUrl: string;
    accountUrl: string;

    constructor(private http: HttpClient) { 
        // this.profileUrl = 'http://localhost:4003/api/profiles';
        this.accountUrl = 'http://localhost:4004/api/accounts';
    }

    getAll() {
        return this.http.get<Account[]>(`${this.accountUrl}`);
    }

    getById(id:string) {
        return this.http.get<Account>(`${this.accountUrl}/${id}`);
    }

    register(account: Account) {
        const myHeaders = new HttpHeaders().set('Content-Type', 'application/json');
        return this.http.post(`${this.accountUrl}/register`, JSON.stringify(account), { headers: myHeaders, responseType: 'json' });
    }

    update(account: Account) {
        const myHeaders = new HttpHeaders().set('Content-Type', 'application/json');
        return this.http.post(`${this.accountUrl}`, JSON.stringify(account), { headers: myHeaders, responseType: 'json' });
    }

    deleteById(id:string) {
        return this.http.delete<Account>(`${this.accountUrl}/${id}`);
    }

    // registerProfile(user: User) {
    //     const myHeaders = new HttpHeaders().set('Content-Type', 'application/json');
    //     return this.http.post(`${this.profileUrl}`, JSON.stringify(user), { headers: myHeaders, responseType: 'json' });
    // }
}