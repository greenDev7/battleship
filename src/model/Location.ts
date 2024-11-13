import GameStore from "../store"

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
    public static getLocationByOffsetXY(offsetX: number, offsetY: number): Location {

        let gcw: number = GameStore.getters.getGridCellWidth;
        let gch: number = GameStore.getters.getGridCellHeight;

        let currentX = Math.floor(offsetX / gcw);
        let currentY = Math.floor(offsetY / gch);

        return new Location(currentX, currentY);
    };

    /**
     * Подсвечивает на канвасе расположение данной локации
     */
    public highlight(ctx: CanvasRenderingContext2D | null, gridCellWidth: number, gridCellHeight: number) {
        if (ctx) {
            ctx.save();
            ctx.fillStyle = "rgb(229 22 35)";
            ctx.fillRect(this._x * gridCellWidth + 3, this._y * gridCellHeight + 3, gridCellWidth - 6, gridCellHeight - 6);
            ctx.restore();
        }
    }
}