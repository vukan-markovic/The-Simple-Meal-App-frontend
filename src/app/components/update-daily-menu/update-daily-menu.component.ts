import { Component, OnInit, Input, HostListener } from '@angular/core';
import { DailyMenu } from 'src/app/models/dailyMenu';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DailyMenuService } from 'src/app/services/daily-menu.service';
import { Meal } from 'src/app/models/meal';
import { MealService } from 'src/app/services/meal.service';
import { MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';

import { FlashMessagesService } from 'angular2-flash-messages';
import { isUndefined } from 'util';
import { Subscription } from 'rxjs';
import { WeeklyMenuService } from 'src/app/services/weekly-menu.service';
import { WeeklyMenuWithId } from 'src/app/models/WeeklyMenuWithId';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-update-daily-menu',
  templateUrl: './update-daily-menu.component.html',
  styleUrls: ['./update-daily-menu.component.css']
})
export class UpdateDailyMenuComponent implements OnInit {

  @Input() dailyMenu: DailyMenu;
  form: FormGroup;
  errorMessage: string = null;
  success: string = null;
  meals: Array<Meal> = [];
  element: HTMLSelectElement;
  displayedColumns: string[] = ['select', 'types', 'name', 'description'];
  mealDataSource: MatTableDataSource<Meal>;
  selection: SelectionModel<Meal>;
  private changedDailyMenu: Subscription;

  //This button I use to close modal dialog for update daily menu
  closeButton: HTMLButtonElement;

  //this input I use to clear filter input field 
  filterInput: HTMLInputElement;

  //subsription for refresh list of meal 
  private successAddedMeal: Subscription;
  dialog: HTMLDivElement;
  weeklyMenu: WeeklyMenuWithId;
  screenHeight: number;
  constructor(public dailyMenuService: DailyMenuService, public mealService: MealService,
    private weeklyMenuService: WeeklyMenuService,private toastr: ToastrService) { }

  ngOnInit() {

    if (this.dailyMenu == null || isUndefined(this.dailyMenu)) {
      this.dailyMenu = new DailyMenu();
    }

    this.selection = new SelectionModel<Meal>(true, []);

    this.changedDailyMenu = this.weeklyMenuService.successEmitter.subscribe(data => {
      this.getMeals();
    });

    this.successAddedMeal = this.mealService.successEmitter.subscribe(data => {
      this.success = "Successfully added a new meal.";
      this.getMeals();
      this.toastr.success(this.success, 'Add meal');
      this.filterInput = document.getElementById("filterInput") as HTMLInputElement;
      this.filterInput.value = "";
    });
    this.getScreenSize();
  }
  
  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
        this.screenHeight = window.innerHeight;
        this.screenHeight = this.screenHeight-150;
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.mealDataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.mealDataSource.data.forEach(row => this.selection.select(row));
  }

  checkboxLabel(row?: Meal): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row `;
  }

  getMeals() {
    this.mealService.getAllMeal().subscribe(data => {
      if (data != null && data.length != 0) {
        this.meals = data;
        this.mealDataSource = new MatTableDataSource(this.meals);
        this.setFilterForTable();
        this.selection = new SelectionModel<Meal>(true, []);
        if (!isUndefined(this.dailyMenu)) {
          this.getImage();
        }
        if (!isUndefined(this.dailyMenu.meals) && this.dailyMenu.meals.length > 0) {
          this.dailyMenu.meals.forEach(meal => {
            this.selectMeal(meal);
          });
        }
      } else {
        this.meals = [];
        this.mealDataSource = new MatTableDataSource(this.meals);
      }
    })
  
  }


  setFilterForTable() {
    const reg = "regular";
    this.mealDataSource.filterPredicate = function (data: Meal, filter: string): boolean {
      if (data.types.length != 1) {
        return reg.includes(filter);
      } else {
        return data.types[0].name.toLowerCase().includes(filter);
      }
    };
  }

  getImage() {
    this.weeklyMenu = JSON.parse(localStorage.getItem('currentWeeklyMenu'));
  }
  selectMeal(meal: Meal) {
    this.mealDataSource.data.forEach(element => {
      if (element.mealId == meal.mealId) {
        this.selection.select(element);
        return;
      }
    })
  }

  close() {
    this.getMeals();
    this.filterInput = document.getElementById("filterInput") as HTMLInputElement;
    this.filterInput.value = "";

  }

  onSubmit() {
    if (this.selection.selected.length == 0) {
      this.errorMessage = "You have to select at least one meal for daily menu.";
      this.toastr.error( this.errorMessage, 'Update daily menu');
      return;
    }

    if (isUndefined(this.dailyMenu) || this.dailyMenu == null || this.dailyMenu.dailyMenuId == 0) {
      this.errorMessage = "This daily menu doesn't exist.";
      this.toastr.error( this.errorMessage, 'Update daily menu');
      this.closeButton = document.getElementById("closeButton") as HTMLButtonElement;
      this.closeButton.click();
      return;
    }

    this.dailyMenu.meals = this.selection.selected;

    this.dailyMenuService.updateDailyMenu(this.dailyMenu).subscribe(
      data => {
        this.success = "Successfully update a daily menu.";
        this.dailyMenuService.successEmitter.next(this.dailyMenu);
        this.toastr.success(this.success, 'Update daily menu');
        this.closeButton = document.getElementById("closeButton") as HTMLButtonElement;
        this.closeButton.click();
      },
      message => {
        this.errorMessage = "You can not change daily menu for today and before today.";
        this.toastr.error( this.errorMessage, 'Update daily menu');
      }
    );
  }

  applyFilter(filterValue: string) {

    this.mealDataSource.filter = filterValue.trim().toLowerCase();
  }

}
