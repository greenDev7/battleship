export default class Location {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    };

    /**
     * Возвращает локацию по координате (x, y) игрового поля
     */
    public static getLocationByOffsetXY(offsetX: number, offsetY: number, cellWidth: number, cellHeight: number): Location {
        let currentX = Math.floor(offsetX / cellWidth);
        let currentY = Math.floor(offsetY / cellHeight);

        return new Location(currentX, currentY);
    }
}