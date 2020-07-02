import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root'})
export class AccountService {
    accountUrl: string;

    constructor(private http: HttpClient) { 
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
        return this.http.put(`${this.accountUrl}`, JSON.stringify(account), { headers: myHeaders, responseType: 'json' });
    }

    deleteById(id:string) {
        return this.http.delete<Account>(`${this.accountUrl}/${id}`);
    }
}