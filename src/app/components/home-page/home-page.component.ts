import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DailyMenu } from 'src/app/models/dailyMenu';
import { MealDTO } from 'src/app/models/mealDTO';
import { Type } from 'src/app/models/type';
import { DailyMenuService } from 'src/app/services/daily-menu.service';
import { TypeService } from 'src/app/services/type.service';
import { OrderService } from 'src/app/services/order.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { RegistrationService } from 'src/app/services/registration.service';
import { Meal } from 'src/app/models/meal';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  readonly VAPID_PUBLIC_KEY = "BJ60P1mNLy6DqemsOKUlOCXnFqTPk53GgxM2KDFL2JJ1edoz1unSAlhy8loG2LA3D0D1Ki3jwIIHXsW844qWzyU";
  dailyMenu: DailyMenu;
  types: Type[] = [];
  showRegular: boolean;
  meals: Array<MealDTO> = [];
  mealsArray: Array<Meal> = [];
  message: String = "";
  token: string;
  quantity: HTMLCollectionOf<HTMLInputElement>;
  isEnabled: boolean;

  constructor(private mealService: DailyMenuService, private typeService: TypeService, private orderService: OrderService,
    private router: Router, private route: ActivatedRoute, private registrationService: RegistrationService,
    private toastr: ToastrService, private authService: AuthenticationService) { }

  ngOnInit() {
    this.getDailyMenu();
    this.quantity = document.getElementsByClassName("quantity") as HTMLCollectionOf<HTMLInputElement>;

    this.route.queryParams.subscribe(
      (queyParams: Params) => {
        this.token = queyParams['token'];
        if (this.token != undefined) this.registrationService.sendToken(this.token);
      }
    );
  }

  onChange(event: { target: HTMLInputElement; }) {
    var count = 0;
    for (var i = 0; i < this.quantity.length; i++) {
      if (+this.quantity.item(i).value > 0) {
        this.isEnabled = true;
        return;
      } else count++;
    }

    if (count == this.quantity.length) this.isEnabled = false;
  }

  getDailyMenu() {
    this.mealService.getDailyMenu().subscribe(dailyMenu => {
      this.dailyMenu = dailyMenu;

      if (this.dailyMenu != null) {
        this.typeService.getAllType().subscribe(types => {
          if (types != null && types.length != 0) {
            this.types = this.removeDuplicates(this.removeUnused(types), "name");
            this.existRegular(this.types);
          }
        });
      }
    });
  }

  existRegular(types: Type[]) {
    types.forEach(type => {
      if (type.regular) {
        this.showRegular = true;
        return;
      }
    })
  }

  removeDuplicates(originalArray, prop) {
    var newArray = [];
    var lookupObject = {};
    for (var i in originalArray) lookupObject[originalArray[i][prop]] = originalArray[i];
    for (i in lookupObject) newArray.push(lookupObject[i]);
    return newArray;
  }

  removeUnused(originalArray) {
    var newArray = [];

    originalArray.forEach(oldType => {
      this.dailyMenu.meals.forEach(meal => {
        meal.types.forEach(type => {
          if (oldType.name == type.name) {
            newArray.push(oldType);
          }
        });
      });
    });
    return newArray;
  }

  onConfirmed(confirmed: boolean) {
    if (confirmed)
      this.orderService.addOrder(this.meals).subscribe(data => {
        this.toastr.success("Food is ordered successfully", 'Ordering food');
        this.resetOrder();

      }, (message: HttpErrorResponse) => {
        if(message.status == 406){
          this.toastr.error("You must sign in to be able to order meals.", 'Ordering food');
        }else if(message.status == 400){
          this.toastr.error("Error occurred while ordering food.", 'Ordering food');
        }else {
          this.toastr.error("You can order food fo today until 10 o'clock. You can order food for tomorrow until 17 o'clock.",'Ordering food');
        }
      });

  }

  arrangeMeals(meals: Meal[]) {
    var mealsArray = [];

    this.types.forEach(type => {
      meals.forEach(meal => {
        if (!meal.types[0].regular && meal.types[0].name == type.name) mealsArray.push(meal);
      });
    });

    meals.forEach(meal => {
      if (meal.types[0].regular) mealsArray.push(meal);
    });

    return mealsArray;
  }

  order() {
    this.meals = [];
    this.mealsArray = this.arrangeMeals(this.dailyMenu.meals);
    var c = 0;

    for (var i = 0; i < this.quantity.length; i++) {
      if (!this.mealsArray[c].types[0].regular) {
        if (+this.quantity.item(i).value > 0) {
          this.meals.push(new MealDTO(this.mealsArray[c], this.mealsArray[c].types[0].name, +this.quantity.item(i).value))
        }
      }

      if (this.mealsArray[c].types[0].regular) {
        for (var j = 0; j < this.mealsArray[c].types.length; j++) {
          if (+this.quantity.item(i).value > 0) {
            this.meals.push(new MealDTO(this.mealsArray[c], this.mealsArray[c].types[j].name, +this.quantity.item(i).value))
          }
          i++;
        }
        i--;
      }
      c++;
    }
  }

  resetOrder() {
    for (var i = 0; i < this.quantity.length; i++) this.quantity.item(i).value = '0';
    this.isEnabled = false;
  }

  menu() {
    this.router.navigate(['addMenu']);
  }

  weeklyMenu() {
    this.router.navigate(['weeklyMenu']);
  }

  isAdmin() {
    return this.authService.isAdmin();
  }
}