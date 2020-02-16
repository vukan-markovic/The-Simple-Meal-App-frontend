import { Component, OnInit, ViewChild } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import { WeeklyMenuWithId } from 'src/app/models/WeeklyMenuWithId';
import { WeeklyMenuService } from 'src/app/services/weekly-menu.service';
import { MealService } from 'src/app/services/meal.service';
import { DailyMenuService } from 'src/app/services/daily-menu.service';
import { DailyMenu } from 'src/app/models/dailyMenu';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Params } from '@angular/router';
import { isUndefined } from 'util';
import { FlashMessagesService } from 'angular2-flash-messages';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-update-weekly-menu',
  templateUrl: './update-weekly-menu.component.html',
  styleUrls: ['./update-weekly-menu.component.css']
})
export class UpdateWeeklyMenuComponent implements OnInit {

  currentWeeklyMenu: WeeklyMenuWithId;
  weeklyMenus: Array<WeeklyMenuWithId>= [];
  dailyMenus: Array<DailyMenu>= [];
  errorMessage: string = null; 
  success: string = null;
  public searchString: Date;
  private successSub: Subscription;
  
  currentDailyMenu: DailyMenu;
  weeklyMenuParam: number;
  dailyMenuDataSource: MatTableDataSource<DailyMenu>;
  displayedColumns: string[] = ['date', 'meals','updateMenu'];
  expandedElement: DailyMenu;

  daily: DailyMenu;
  constructor(private weeklyMenuService: WeeklyMenuService, private dailyMenuService: DailyMenuService,
    private mealService: MealService, private route: ActivatedRoute,private flashMessage: FlashMessagesService,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.getWeeklyMenus();

    this.successSub = this.dailyMenuService.successEmitter.subscribe(data => {
      this.getDailyMenus();
    });

    this.route.params.subscribe(
      (params: Params) => {
        this.weeklyMenuParam = params['id'];
      }
    );

  }

  getWeeklyMenus(){
    this.weeklyMenuService.getAllWeeklyMenu().subscribe(weeklyMenus => {
      if (weeklyMenus != null && weeklyMenus.length != 0){
        this.weeklyMenus = weeklyMenus; 
      
        if(isUndefined(this.weeklyMenuParam)){
          this.currentWeeklyMenu=this.weeklyMenus[0];
          this.getDailyMenus();
        }else {
          this.setCurrentWeeklyMenu();
        }
      }else {
        this.weeklyMenus =[];
      }
    });
  }

  setCurrentWeeklyMenu(){
    this.weeklyMenus.forEach(element => {
      if(element.weaklyMenuId == this.weeklyMenuParam){
        this.currentWeeklyMenu=element;
        return;
      }
    });
    
    if(isUndefined(this.currentWeeklyMenu)){
      this.currentWeeklyMenu=this.weeklyMenus[0];
    }
    this.getDailyMenus();
  }

  getDailyMenus(){
    this.dailyMenuService.getDailyMenus(this.currentWeeklyMenu).subscribe(dailyMenus => {
      if (dailyMenus != null && dailyMenus.length != 0){
        this.dailyMenus = dailyMenus; 
        this.dailyMenuDataSource = new MatTableDataSource(this.dailyMenus);
        this.errorMessage=null;
      }else {
        this.dailyMenus=[];
        this.dailyMenuDataSource = new MatTableDataSource(this.dailyMenus);
      }
    });
  }

  onChange(currentWeeklyMenu: WeeklyMenuWithId) {
      this.getDailyMenus();
  }

  updateDailyMenu(dailyMenu:DailyMenu){
   
    if(dailyMenu != null){
      this.currentDailyMenu=dailyMenu;
      localStorage.setItem('currentWeeklyMenu', JSON.stringify(this.currentWeeklyMenu));
      this.weeklyMenuService.successEmitter.next(this.currentDailyMenu);
    }
  }
}
