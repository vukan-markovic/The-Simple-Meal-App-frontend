import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';
import { take } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environment';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class MessagingService {
  baseurl = environment.baseUrl;
  messaging = firebase.messaging();
  currentMessage = new BehaviorSubject(null);
  token: string;

  constructor(private db: AngularFireDatabase, private afAuth: AngularFireAuth, private http: HttpClient, private authService: AuthenticationService) { }

  updateToken(token: string) {
    this.afAuth.authState.pipe(take(1)).subscribe(user => {
      if (!user) {
        return;
      }

      const data = { [user.uid]: token }
      this.db.object('fcmTokens/').update(data)
    })
  }

  getPermission() {
    this.messaging.requestPermission()
      .then(() => {

        return this.messaging.getToken()
      })
      .then(token => {
        this.token = token;
        this.sendTokenToBackend(token);
        this.updateToken(token); 

        return this.messaging.getToken()
      })
      .catch((err) => {

      });
  }

  receiveMessage() {
    this.messaging.onMessage((payload) => {

      this.currentMessage.next(payload);
      if (this.authService.currentUserSubject.value && this.authService.currentUserSubject.value.role != "ADMIN") {
        if (payload['notification']['title'] == "Reminder for chosen one")
          this.authService.currentUserSubject.value.role = "CHOSEN";
        if (payload['notification']['title'] == "Chosen one changed")
          this.authService.currentUserSubject.value.role = "USER";
        // localStorage.setItem('currentUser', JSON.stringify(user));
        // this.currentUserSubject.next(user);

      }
    });
  }

  sendTokenToBackend(token: String) {
    if (this.authService.currentUserSubject.value != undefined
      && this.authService.currentUserSubject.value != null) {
      this.http.post(this.baseurl + '/notification/token',
        {
          "token": this.token
        }).subscribe(data => { });
    }
  }

}