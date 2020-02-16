import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Order } from 'src/app/models/order';
import { ChosenOneService } from 'src/app/services/chosenOne.service';
import { OrderService } from 'src/app/services/order.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'admin-orders',
    templateUrl: 'admin-orders.component.html',
    styleUrls: ['admin-orders.component.css']
})
export class AdminOrders implements OnInit, AfterViewInit {

    orders: Array<Order> = [];
    showDialog: boolean;
    forDay: string;
    errorMessage: string = null;
    success: string = null;
    orderEmpty: boolean = false;
    dataSource: MatTableDataSource<Order>;
    displayedColumns: string[] = ['user.name', 'user.lastName', 'user.email',
        'meal.name', 'meal.description', 'type.name', 'type.price', 'paid', 'userOrderId' ];

    @ViewChild('combobox', { static: false }) combobox: ElementRef;

    constructor(private router: Router,
        private chosenOneService: ChosenOneService,
        private orderService: OrderService,
        private authService: AuthenticationService,
        private toastr: ToastrService) {
    }

    ngOnInit(): void {
        if (!this.authService.isLoggedIn() || !this.authService.isAdmin()) this.router.navigate(['/']);
    }

    ngAfterViewInit() {
        this.forDay = this.combobox.nativeElement.value;

        this.chosenOneService.getTodayOrders(this.forDay).subscribe(
            data => {
                if (data && data.length != 0) {
                    this.orders = data;
                    this.dataSource = new MatTableDataSource(data);
                    this.orderEmpty = false;
                } else {
                    this.orderEmpty = true;
                }

            }
        );
    }

    onComboboxChange(forDay: string) {
        this.forDay = forDay
        this.chosenOneService.getTodayOrders(forDay).subscribe(
            data => {
                if (data != null && data.length != 0) {
                    this.orders = data;
                    this.dataSource = new MatTableDataSource(data);
                    this.orderEmpty = false;
                } else {
                    this.orderEmpty = true;
                    this.orders = [];
                    this.dataSource = new MatTableDataSource(this.orders);
                }
            }
        );
    }

    onBtnClick(orderId: number) {
        this.showDialog = true;
    }

    onConfirm(confirmed: boolean, orderId: number) {
        if (confirmed) {
            this.orderService.deleteOrder(orderId).subscribe(
                    data => {
                        this.success = "Successfully delete a order";
                        this.onComboboxChange(this.forDay);
                        this.toastr.success(this.success, 'Cancel order');
                    },
                    message => {
                        this.errorMessage = "Error occurred while deleting a order.You can delete your order for today until 10 o'clock and " +
                            "you can delete your order for tomorrow until 17 o'clock.";
                        this.toastr.error(this.errorMessage, 'Cancel order');
                    }
                );
        }
    }

}
