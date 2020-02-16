import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Order } from '../models/order';
import { UserDTO } from '../models/userDTO';
import { environment } from '../environment';

@Injectable()
export class ChosenOneService {
    baseurl = environment.baseUrl;

    constructor(private http: HttpClient) { }

    getTodayOrders(forDay: string) {
        return this.http.get<Order[]>(this.baseurl + "/ordering/allOrders", { params: new HttpParams().set("forDay", forDay) });
    }

    setOrderPaid(order: Order) {
        return this.http.post<any>(this.baseurl + "/chosenOne/setPaid", order);
    }

    getChosenOne() {
        return this.http.get<UserDTO>(this.baseurl + "/chosenOne/getChosenOne");
    }

    payingNotification(userIds: Array<number>) {
        return this.http.post<any>(this.baseurl + "/chosenOne/payingNotification", { userIds: userIds });
    }

}
