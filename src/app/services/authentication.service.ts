import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user';
import { environment } from '../environment';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    baseurl = environment.baseUrl;
    public currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    public setCurrentUserRole(role: string) {
        this.currentUserSubject.value.role = role;
    }

    isLoggedIn() {
        return localStorage.getItem('currentUser') !== null;
    }

    isAdmin() {
        if (this.isLoggedIn())
            return this.currentUserSubject.value.role == "ADMIN";
    }

    isChoosenOne() {
        if (this.isLoggedIn())
            return this.currentUserSubject.value.role == "CHOSEN";
    }

    login(email: string, password: string) {
        return this.http.post<any>(this.baseurl + '/api/login', { email, password }).pipe(map(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);
            return user;
        }));
    }

    resetPassword(email: String) {
        return this.http.post(this.baseurl + '/api/resetPassword', email, { responseType: 'text' });
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }
}