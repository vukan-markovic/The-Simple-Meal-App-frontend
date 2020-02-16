import { Injectable } from '@angular/core';
import { Meal } from '../models/meal';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AddMealDTO } from '../models/addMealDTO';
import { MealUpdate } from '../models/updateMeal';
import { environment } from '../environment';
import { InsertMealDTO } from '../models/inserMealDTO';

@Injectable()
export class MealService {
    baseurl = environment.baseUrl;
    dataChange: BehaviorSubject<Meal[]> = new BehaviorSubject<Meal[]>([]);
    successEmitter = new Subject<InsertMealDTO>();

    successEmitterUpdate = new Subject<MealUpdate>();
    constructor(private httpClient: HttpClient) { }

    public getAllMeal(): Observable<Meal[]> {
        this.httpClient.get<Meal[]>(this.baseurl + '/meal/all/').subscribe(data => {
            this.dataChange.next(data);
        },
            (error: HttpErrorResponse) => {
                
            });

        return this.dataChange.asObservable();
    }

    public addMeal(meal: InsertMealDTO) {
        return this.httpClient.post(this.baseurl + '/meal/', meal);
    }

    public updateMeal(meal: MealUpdate) {
        return this.httpClient.put(this.baseurl + '/meal/', meal);
    }

    public deleteMeal(id: number): void {
        this.httpClient.delete(this.baseurl + '/meal/' + id).subscribe();
    }
}