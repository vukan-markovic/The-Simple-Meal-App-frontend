import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserDTO } from '../models/userDTO';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  baseUrl = environment.baseUrl;
  dataChange: BehaviorSubject<UserDTO[]> = new BehaviorSubject<UserDTO[]>([]);
  dataChangeUser: BehaviorSubject<UserDTO> = new BehaviorSubject<UserDTO>(null);
  dataChangeImage: BehaviorSubject<any> = new BehaviorSubject<any>(null);


  constructor(private httpClient: HttpClient) { }

  public getUsers(): Observable<UserDTO[]> {
    this.httpClient.get<UserDTO[]>(this.baseUrl + '/user/all').subscribe(data => {
      this.dataChange.next(data);
    },
      (error: HttpErrorResponse) => {

      });
    return this.dataChange.asObservable();
  }

  public updateUser(userId: number, command: string): boolean {
    let result: boolean = false;

    this.httpClient.put(this.baseUrl + "/user/" + userId + "/" + command, null).subscribe(suc => result = true);

    return result;
  }

  public getUser(email: string): Observable<UserDTO> {
    this.httpClient.get<UserDTO>(this.baseUrl + '/user/email/' + email).subscribe(data => {
      this.dataChangeUser.next(data);
    },
      (error: HttpErrorResponse) => {

      });

    return this.dataChangeUser.asObservable();
  }

  public updateUserEmail(userId: number, email: String) {
    return this.httpClient.put(this.baseUrl + '/user/' + userId, email, { responseType: 'text' });
  }


  public updateUserImage(userId: number, imagePath: string) {
    return this.httpClient.put(this.baseUrl + '/user/image/' + userId, imagePath, { responseType: 'text' });
  }

  public updatePassword(password: String, token: String) {
    return this.httpClient.put(this.baseUrl + '/user/updatePassword/' + token, password, { responseType: 'text' });
  }

  public addImage(image: FormData): Observable<any> {
    this.httpClient.post<any>(this.baseUrl + '/file/avatar', image).subscribe(data => {
      this.dataChangeImage.next(data);
    },
      (error: HttpErrorResponse) => {

      });

    return this.dataChangeImage.asObservable();
  }

  public getImage(imagePath: any) {
    this.httpClient.get(this.baseUrl + "/file", imagePath).subscribe(data => {
      this.dataChangeImage.next(data);
    },
      (error: HttpErrorResponse) => {

      });

    return this.dataChangeImage.asObservable();
  }
}