import Location from "./Location";
import ShipType from "./ShipType";


export default class Ship {
    private _length: number;
    private _type: ShipType;
    private _location: Location;

    constructor(_length: number, _type: ShipType, _location: Location) {
        this._length = _length;
        this._type = _type;
        this._location = _location;
    };

    public get length(): number {
        return this._length;
    };
    public set length(v: number) {
        this._length = v;
    };

    public get type(): ShipType {
        return this._type;
    };
    public set type(v: ShipType) {
        this._type = v;
    };

    public get location(): Location {
        return this._location;
    };
    public set location(v: Location) {
        this._location = v;
    };

    /**
     * Создает экземпляр корабля
     */
    public static createShip(length: number, type: ShipType, x: number, y: number): Ship {
        return new Ship(length, type, new Location(x, y));
    };
    /**
     * Рисует корабль
     */
    public draw(ctx: CanvasRenderingContext2D | null, gridCellWidth: number, gridCellHeight: number) {

        let rw, rh: number;

        if (ctx) {
            ctx.save();
            ctx.strokeStyle = "black";
            ctx.lineWidth = 2;

            if (this._type === ShipType.Horizontal) {
                rw = this._length * gridCellWidth;
                rh = gridCellHeight;

            } else {
                rw = gridCellWidth;
                rh = this._length * gridCellHeight;
            };

            this.drawBulkhead(ctx, gridCellWidth, gridCellHeight);

            ctx.strokeRect(this._location.x * gridCellWidth + 1, this._location.y * gridCellHeight + 1, rw - 2, rh - 2);
            ctx.restore();
        }
    };
    /**
     * Рисует перемычки корабля
     */
    private drawBulkhead(ctx: CanvasRenderingContext2D | null, gridCellWidth: number, gridCellHeight: number) {
        if (ctx) {
            ctx.beginPath();
            for (let i = 1; i < this._length; i++) {

                let x0 = this._location.x * gridCellWidth;
                let y0 = this._location.y * gridCellHeight;

                if (this._type === ShipType.Horizontal) {
                    ctx.moveTo(x0 + i * gridCellWidth, y0);
                    ctx.lineTo(x0 + i * gridCellWidth, y0 + gridCellHeight);
                }
                else /* if (this._type === ShipType.Vertical) */ {
                    ctx.moveTo(x0, y0 + i * gridCellHeight);
                    ctx.lineTo(x0 + gridCellWidth, y0 + i * gridCellHeight);
                }

            };
            ctx.stroke();
        }
    };
    /**
     * Меняет тип корабля
     */
    public changeShipType() {
        if (this._type === ShipType.Horizontal)
            this._type = ShipType.Vertical;
        else
            this._type = ShipType.Horizontal;
    };
    /**
     * Возвращает множество координат (локаций), принадлежащих данному кораблю
     */
    public getLocations(): Location[] {
        // Сразу добавляем координату первой (головной) клетки корабля
        // т.к. она будет общей как для горизонтального, так и для вертикального корабля
        let locations: Location[] = [this._location];

        if (this._type === ShipType.Horizontal)
            for (let i = 1; i < this._length; i++)
                locations.push(new Location(this._location.x + i, this._location.y));
        else
            for (let i = 1; i < this._length; i++)
                locations.push(new Location(this._location.x, this._location.y + i));

        return locations;
    };
    /**
     * Возвращает true и координаты пересечений обоих кораблей, если данный корабль пересекается с кораблем ship, иначе возвращает false
     */
    public isIntersect(ship: Ship): [boolean, Location | undefined, Location | undefined] {
        for (const loc1 of this.getLocations())
            for (const loc2 of ship.getLocations())
                if (Math.abs(loc1.x - loc2.x) <= 1 && Math.abs(loc1.y - loc2.y) <= 1)
                    return [true, loc1, loc2];

        return [false, undefined, undefined];
    }
}