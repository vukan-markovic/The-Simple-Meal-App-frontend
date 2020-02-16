import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { MealDTO } from '../models/mealDTO';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../environment';
import { Order } from '../models/order';

@Injectable()
export class OrderService {
    baseurl = environment.baseUrl;
    dataChange: BehaviorSubject<string> = new BehaviorSubject<string>("");

    constructor(private httpClient: HttpClient) { }
    
    public addOrder(meals: MealDTO[]) {
        return this.httpClient.post(this.baseurl + '/ordering', meals);
    }

    getOrders(forDay: string) {
        return this.httpClient.get<Order[]>(this.baseurl + '/ordering' + "/all", { params: new HttpParams().set("forDay", forDay) });
    }

    getUserOrders(forDay: string) {
        return this.httpClient.get<Order[]>(this.baseurl + '/ordering' + "/all", { params: new HttpParams().set("forDay", forDay) });
    }

    deleteOrder(orderId: number) {
        return this.httpClient.delete(this.baseurl + '/ordering/' + orderId,{ responseType: 'text' });
    }
}