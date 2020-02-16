import { Component, OnInit } from '@angular/core';
import { ChosenOneService } from 'src/app/services/chosenOne.service';
import { Order } from 'src/app/models/order';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'today-orders',
    templateUrl: 'todayOrders.component.html',
    styleUrls: ['todayOrders.component.css']
})
export class TodayOrders implements OnInit {

    orders: Array<Order> = [];
    groupedOrders: Map<number, Array<Order>> = new Map();
    sum: Map<number, number> = new Map();
    showDetails: Map<number, boolean> = new Map();
    success;
    errorMsg;

    constructor(private chosenOneService: ChosenOneService,
        private authService: AuthenticationService,
        private router: Router, private toastr: ToastrService) { }

    ngOnInit(): void {
        this.getOrders();
    }

    getOrders() {
        this.chosenOneService.getTodayOrders("today").subscribe(data => {
            this.orders = data;
            if (data) {
                data.forEach(order => {
                    if (!this.groupedOrders.has(order.user.userId))
                        this.groupedOrders.set(order.user.userId, new Array<Order>());
    
                    this.groupedOrders.get(order.user.userId).push(order);
    
                    if (this.sum.has(order.user.userId))
                        this.sum.set(order.user.userId, this.sum.get(order.user.userId) + order.type.price);
                    else
                        this.sum.set(order.user.userId, order.type.price);
    
                    if (!this.showDetails.has(order.user.userId))
                        this.showDetails.set(order.user.userId, false);
                });
            }
        });
    }
    checkboxChanged(values: any, orders: Array<Order>) {
        orders.forEach(order => {
            order.paid = values.currentTarget.checked;
            this.chosenOneService.setOrderPaid(order).subscribe();
            this.success = null;
            this.errorMsg = null;
        });
    }

    notify() {
        let userIds: Array<number> = [];
        this.groupedOrders.forEach(orders => {
            if (!orders[0].paid) userIds.push(orders[0].user.userId);
        });
        if (userIds.length == 0) {
            this.errorMsg = "There is no unpaid orders.";
            setTimeout(() => {this.errorMsg = null }, 8000);
            return;
        }
        this.chosenOneService.payingNotification(userIds).subscribe(response => { this.success = "Notification sent successfully.";
            this.errorMsg = null;
            setTimeout(() => { this.success = null }, 8000);
        },
        err => { this.success = null;
                this.errorMsg = "Notification not sent.";
        });
    }

}