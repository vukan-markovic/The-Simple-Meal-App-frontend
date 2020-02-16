import { Component, OnInit, ViewChild } from '@angular/core';
import { Order } from 'src/app/models/order';
import { OrderService } from 'src/app/services/order.service';

import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';




@Component({
  selector: 'app-order-canceling',
  templateUrl: './order-canceling.component.html',
  styleUrls: ['./order-canceling.component.css']
})
export class OrderCancelingComponent implements OnInit {

  orderEmpty: boolean = true;
  orders: Array<Order> = [];
  forDay: string = "today";
  errorMessage: string = null;
  success: string = null;

  @ViewChild(MatSort, { static: true }) sort: MatSort;


  displayedColumns: string[] = ['name', 'type', 'price', 'cancel'];
  orderCancelingdataSource: MatTableDataSource<Order>;

  constructor(private orderService: OrderService, private toastr: ToastrService) { }

  ngOnInit() {
    this.getOrders();
  }

  getOrders() {
    this.orderService.getOrders(this.forDay).subscribe(
      data => {
        if (data != null && data.length != 0) {
          this.orders = data;
          this.orderEmpty = false;
          this.orderCancelingdataSource = new MatTableDataSource(data);
          this.orderCancelingdataSource.sort = this.sort;
        } else {
          this.orderEmpty = true;
          this.orders=[];
          this.orderCancelingdataSource =new MatTableDataSource(this.orders);
        }

      }
    );
  }

  onChange() {
    this.getOrders();
  }

  orderCanceling(order: Order) {
    if (order != null) {
      this.orderService.deleteOrder(order.userOrderId).subscribe(
        data => {
          this.errorMessage = null;
          this.success = "Successfully delete a order";
          this.toastr.success(this.success, 'Cancel order');
          this.onChange();
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
