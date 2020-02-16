export class WeeklyMenuWithId {
    dateFrom: Date;
    dateTo: Date;
    imagePath: String;
    weaklyMenuId: number;
    constructor(dateFrom: Date, dateTo: Date, imagePath: String, weaklyMenuId: number) {
        this.dateFrom = dateFrom;
        this.dateTo = dateTo;
        this.imagePath = imagePath;
        this.weaklyMenuId = weaklyMenuId;
    }
}