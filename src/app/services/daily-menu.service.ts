import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DailyMenu } from '../models/dailyMenu';
import { WeeklyMenuWithId } from '../models/WeeklyMenuWithId';
import { environment } from '../environment';
import { DailyMenuAdd } from '../models/dailyMenuAdd';

@Injectable()
export class DailyMenuService {
    baseurl = environment.baseUrl;
    dataChange: BehaviorSubject<DailyMenu[]> = new BehaviorSubject<DailyMenu[]>([]);
    dataChangeMenu: BehaviorSubject<DailyMenu> = new BehaviorSubject<DailyMenu>(null);
    dataChangeDay: BehaviorSubject<Date[]> = new BehaviorSubject<Date[]>([]);
    dataChangeDailyMenus: BehaviorSubject<DailyMenu[]> = new BehaviorSubject<DailyMenu[]>([]);
    successEmitter = new Subject<DailyMenu>();
    constructor(private httpClient: HttpClient) { }

    public getDailyMenu(): Observable<DailyMenu> {
        this.httpClient.get<DailyMenu>(this.baseurl + '/daily-menu/').subscribe(data => {
            this.dataChangeMenu.next(data);
        },
            (error: HttpErrorResponse) => {

            });

        return this.dataChangeMenu.asObservable();
    }

    public getDailyMenus(weeklyMenu: WeeklyMenuWithId): Observable<DailyMenu[]> {
        this.httpClient.get<DailyMenu[]>(this.baseurl + '/daily-menu/all/' + weeklyMenu.weaklyMenuId).subscribe(
            data => {
                this.dataChangeDailyMenus.next(data);
            }, (error: HttpErrorResponse) => {
            });
        return this.dataChangeDailyMenus.asObservable();
    }

    public getDays(weeklyMenu: WeeklyMenuWithId): Observable<Date[]> {
        this.httpClient.get<Date[]>(this.baseurl + '/daily-menu/days/' + weeklyMenu.weaklyMenuId).subscribe(
            data => {
                this.dataChangeDay.next(data);
            }, (error: HttpErrorResponse) => {
                
            }
        );
        return this.dataChangeDay.asObservable();
    }

    public addDailyMenu(dailyMenu: DailyMenuAdd) {
        return this.httpClient.post(this.baseurl + '/daily-menu/', dailyMenu);
    }

    public updateDailyMenu(dailyMenu: DailyMenu) {
        return this.httpClient.put(this.baseurl + '/daily-menu/', dailyMenu);
    }

    public deleteDailyMenu(id: number): void {
        this.httpClient.delete(this.baseurl + '/daily-menu/' + id);
    }
}