import { WeeklyMenu } from './weeklyMenu';
import { Meal } from './meal';
import { WeeklyMenuWithId } from './WeeklyMenuWithId';

export class DailyMenu {
    dailyMenuId:number;
    date: Date;
    weeklyMenu: WeeklyMenu;
    meals: Array<Meal>;

    constructor(dailyMenuId?:number,date?: Date, meals?: Array<Meal>,weeklyMenu?: WeeklyMenu) {
        this.date = date;
        this.weeklyMenu = weeklyMenu;
        this.meals = meals;
        this.dailyMenuId=dailyMenuId;
    } 
}