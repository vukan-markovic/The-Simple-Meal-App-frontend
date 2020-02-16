export class WeeklyMenu {
    from: Date;
    to: Date;
    image: String;

    constructor(dateFrom?: Date, dateTo?: Date, imagePath?: String) {
        this.from = dateFrom;
        this.to = dateTo;
        this.image = imagePath;
    }
}