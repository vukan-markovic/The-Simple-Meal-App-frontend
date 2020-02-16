export class MealUpdate {
    id: number;
    name: String;
    description: String;
    earlyOrder: boolean;

    constructor(id: number, name: String, description: String, earlyOrder: boolean) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.earlyOrder = earlyOrder;
    }
}