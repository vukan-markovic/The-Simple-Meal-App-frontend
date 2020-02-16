import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { UserReg } from '../models/userReg';
import { Router } from '@angular/router';
import { environment } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  baseurl = environment.baseUrl;

  constructor(private http: HttpClient, private router: Router) { }

  register(user: UserReg) {
    return this.http.post(this.baseurl + '/api/register', user);
  }

  sendToken(token: string) {
    this.http.post(this.baseurl + '/api/confirmAccount', null, {
      params: new HttpParams().set('token', token)
    }).subscribe(data => {
      this.router.navigate(['/login']);
    },
      error => {
      });
  }
}