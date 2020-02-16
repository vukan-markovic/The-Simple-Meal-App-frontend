import { Component, OnInit } from '@angular/core';
import { WeeklyMenuService } from 'src/app/services/weekly-menu.service';
import { WeeklyMenu } from 'src/app/models/weeklyMenu';

@Component({
  selector: 'app-weekly-menu',
  templateUrl: './weekly-menu.component.html',
  styleUrls: ['./weekly-menu.component.css']

})
export class WeeklyMenuComponent implements OnInit {
  weeklyMenu: WeeklyMenu;

  constructor(private weeklyMenuService: WeeklyMenuService) { }

  ngOnInit() {
    this.weeklyMenuService.getWeeklyMenu().subscribe(data => {
      this.weeklyMenu = data;
    })
  }
}