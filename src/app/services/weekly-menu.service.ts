import { Injectable } from '@angular/core';
import { WeeklyMenu } from '../models/weeklyMenu';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { WeeklyMenuWithId } from '../models/WeeklyMenuWithId';
import { DailyMenu } from '../models/dailyMenu';

import { environment } from '../environment';

@Injectable()
export class WeeklyMenuService {
    dataChange: BehaviorSubject<WeeklyMenu> = new BehaviorSubject<WeeklyMenu>(null);
    dataChangeImage: BehaviorSubject<JSON> = new BehaviorSubject<JSON>(null);
    dataChanges: BehaviorSubject<WeeklyMenuWithId[]> = new BehaviorSubject<WeeklyMenuWithId[]>([]);
    dataChangesAll: BehaviorSubject<WeeklyMenuWithId[]> = new BehaviorSubject<WeeklyMenuWithId[]>([]);

    //Event for dailymenu 
    successEmitter = new Subject<DailyMenu>();

    baseurl = environment.baseUrl;

    constructor(private httpClient: HttpClient) { }

    public getWeeklyMenu(): Observable<WeeklyMenu> {
        this.httpClient.get<WeeklyMenu>(this.baseurl + '/weekly-menu').subscribe(data => {
            this.dataChange.next(data);
        },
            (error: HttpErrorResponse) => {
                console.log(error.name + ' ' + error.message);
            });
        return this.dataChange.asObservable();
    }

    public getAllWeeklyMenu(): Observable<WeeklyMenuWithId[]> {
        this.httpClient.get<WeeklyMenuWithId[]>(this.baseurl + '/weekly-menu/all/').subscribe(data => {
            this.dataChanges.next(data);
        },
            (error: HttpErrorResponse) => {
            });

        return this.dataChanges.asObservable();
    }


    //TODO: Maybe-> You will need to add /weeklu-menu before /file
    public addImage(image: FormData): Observable<any> {
        this.httpClient.post<any>(this.baseurl + '/file/weekly-menu', image).subscribe(data => {
            this.dataChangeImage.next(data);
        },
            (error: HttpErrorResponse) => {
            });

        return this.dataChangeImage.asObservable();
    }

    public addWeeklyMenu(WeeklyMenu: WeeklyMenu) {
        return this.httpClient.post(this.baseurl + '/weekly-menu', WeeklyMenu);
    }

    public updateWeeklyMenu(WeeklyMenu: WeeklyMenu): void {
        this.httpClient.put(this.baseurl + '/weekly-menu', WeeklyMenu).subscribe();
    }

    public deleteWeeklyMenu(id: number): void {
        this.httpClient.delete(this.baseurl + '/weekly-menu/' + id).subscribe();
    }
}