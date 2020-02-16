export class Type {
    typeId: number;
    name: String;
    price: number;
    regular: boolean;
    constructor(name?: String, price?: number, regular?: boolean, typeId?: number) {
        this.name = name;
        this.price = price;
        this.typeId = typeId;
        this.regular = regular;
    }
}