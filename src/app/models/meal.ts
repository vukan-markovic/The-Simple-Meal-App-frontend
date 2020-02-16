import { Type } from './type';

export class Meal {
    mealId: number;
    name: String;
    description: String;
    earlyOrder: boolean;
    types: Type[];
    isRegular: boolean;

    constructor(mealId?: number, name?: String, description?: String, earlyOrder?: boolean, types?: Type[], isRegular?: boolean) { }

    setId(mealId: number): void {
        this.mealId = mealId;
    }

    setName(name: String): void {
        this.name = name;
    }

    setDescription(description: String): void {
        this.description = description;
    }

    setEarlyOrder(earlyOrder: boolean): void {
        this.earlyOrder = earlyOrder;
    }


    setTypes(types: Type[]): void {
        this.types = types;
    }

    setRegular(isRegular: boolean): void {
        this.isRegular = isRegular;
    }
}