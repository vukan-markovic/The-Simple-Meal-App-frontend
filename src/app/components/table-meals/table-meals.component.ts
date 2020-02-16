import { Component, OnInit, ViewChild } from '@angular/core';
import { MealService } from 'src/app/services/meal.service';
import { Meal } from 'src/app/models/meal';
import { Subscription } from 'rxjs';

import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { FlashMessagesService } from 'angular2-flash-messages';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-table-meals',
  templateUrl: './table-meals.component.html',
  styleUrls: ['./table-meals.component.css']
})
export class TableMealsComponent implements OnInit {

  meals: Array<Meal> = [];
  isEmpty: boolean;
  public searchString: string;
  private successSub: Subscription;
  currentMeal: Meal;
  show: boolean = false;

  displayedColumns: string[] = ['name', 'description', 'update'];
  mealsDataSource: MatTableDataSource<Meal>;

  //this input I use to clear filter input field 
  filterInput: HTMLInputElement;

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  //subsription for refresh list of meal 
  private successAddedMeal: Subscription;

  constructor(private mealService: MealService, iconRegistry: MatIconRegistry, sanitizer: DomSanitizer,
    private toastr: ToastrService) {
    iconRegistry.addSvgIcon(
      'search',
      sanitizer.bypassSecurityTrustResourceUrl('assets/search.svg'));
  }

  ngOnInit() {

    this.successSub = this.mealService.successEmitterUpdate.subscribe(data => {
      this.toastr.success("Successfully update a meal.", 'Update meal');
      this.getMeals();
    });

    this.getMeals();

    this.successAddedMeal = this.mealService.successEmitter.subscribe(data => {
      this.toastr.success("Successfully added a new meal.", 'Add meal');
      this.getMeals();
    });

  }

  giveFocus() {
    var filter = document.getElementById("filter");
    filter.focus();
  }

  getMeals() {
    this.filterInput = document.getElementById("filterInput") as HTMLInputElement;
    this.filterInput.value = "";
    this.mealService.getAllMeal().subscribe(data => {
      if (data != null && data.length != 0) {
        this.meals = data;
        this.mealsDataSource = new MatTableDataSource(this.meals);
        this.mealsDataSource.sort = this.sort;
        this.isEmpty = false;
      } else {
        this.isEmpty = true;
      }

    })
  }
  update(meal: Meal) {
    if (meal != null) {
      this.show = true;
      this.currentMeal = meal;

    }
  }

  applyFilter(filterValue: string) {
    this.mealsDataSource.filter = filterValue.trim().toLowerCase();
  }
}