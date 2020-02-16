import { Type } from './type';

export class AddMealDTO {
    name: String;
    description: String;
    earlyorder: boolean;
    type: Type;
    price: number;

    constructor(name: String, description: String, earlyorder: boolean, type: Type, price: number) {
        this.name = name;
        this.description = description;
        this.earlyorder = earlyorder;
        this.type = type;
        this.price = price;
    }
}