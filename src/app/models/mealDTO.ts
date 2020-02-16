import { Meal } from './meal';

export class MealDTO {
    meal: Meal;
    regular: String;
    count: number;

    constructor(meal?: Meal, regular?: String, quantity?: number) {
        this.meal = meal;
        this.regular = regular;
        this.count = quantity;
    }
}