import { WeeklyMenu } from './weeklyMenu';
import { Meal } from './meal';

export class DailyMenuAdd {
    date: Date;
    weeklyMenu: WeeklyMenu;
    meals: Array<Meal>;

    constructor(date: Date, weeklyMenu: WeeklyMenu, meals: Array<Meal>) {
        this.date = date;
        this.weeklyMenu = weeklyMenu;
        this.meals = meals;
    }
}