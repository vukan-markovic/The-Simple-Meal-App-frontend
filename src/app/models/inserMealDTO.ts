import { Type } from './type';
import { Meal } from './meal';

export class InsertMealDTO{
    meal: Meal;
    types: Array<Type>;

    constructor(meal: Meal,types: Array<Type>){
        this.meal = meal;
        this.types = types;
    }
}