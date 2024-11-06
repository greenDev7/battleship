export default class Location {
    private _x: number;
    private _y: number;

    constructor(_x: number, _y: number) {
        this._x = _x;
        this._y = _y;
    };

    public get x(): number {
        return this._x;
    };
    public set x(v: number) {
        this._x = v;
    };

    public get y(): number {
        return this._y;
    };
    public set y(v: number) {
        this._y = v;
    };

    /**
     * Возвращает локацию по координате игрового поля
     */
    public static getLocationByOffsetXY(offsetX: number, offsetY: number, cellWidth: number, cellHeight: number): Location {
        let currentX = Math.floor(offsetX / cellWidth);
        let currentY = Math.floor(offsetY / cellHeight);

        return new Location(currentX, currentY);
    };
}