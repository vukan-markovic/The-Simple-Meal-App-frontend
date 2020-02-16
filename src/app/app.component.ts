import { Component, Inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd } from '@angular/router';
import { Router } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';
import { User } from './models/user';
import { MessagingService } from './services/messaging.service';
import { ChosenOneService } from './services/chosenOne.service';
import { UserDTO } from './models/userDTO';
import { OrderService } from './services/order.service';
import { Order } from './models/order';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: []
})
export class AppComponent {
  currentUser: User;
  message;

  chosenOne: UserDTO;
  currentUserOrders: Order[];
  ordersSum: number = 0;
  haveUnpaidOrder: boolean = false;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    @Inject(MessagingService) private msgService: MessagingService,
    private chosenOneService: ChosenOneService,
    private orderingService: OrderService
  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd && this.authenticationService.isLoggedIn()) {
        this.msgService.getPermission();
        this.msgService.receiveMessage();
        this.message = this.msgService.currentMessage;

        this.chosenOneService.getChosenOne().subscribe(
          data => {
            this.chosenOne = data;
          }
        );

        this.orderingService.getOrders("today").subscribe(response => {
          this.currentUserOrders = response;
          if (response) {
            this.ordersSum = 0;
            response.forEach(order => {
              this.ordersSum += order.type.price;
              if (!order.paid) {
                this.haveUnpaidOrder = true;
              }
            });
          }
        });
      }
    });
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
}