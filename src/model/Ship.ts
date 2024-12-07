import GameStore from "@/store/index";
import Location from "./Location";
import ShipOrientation from "./enums/ShipOrientation";


export default class Ship {
    private _length: number;
    private _type: ShipOrientation;
    private _location: Location;
    private _hitsNumber: number;

    constructor(_length: number, _type: ShipOrientation, _location: Location) {
        this._length = _length;
        this._type = _type;
        this._location = _location;
        this._hitsNumber = 0;
    }

    public get length(): number {
        return this._length;
    }
    public set length(v: number) {
        this._length = v;
    }

    public get type(): ShipOrientation {
        return this._type;
    }
    public set type(v: ShipOrientation) {
        this._type = v;
    }

    public get location(): Location {
        return this._location;
    }
    public set location(v: Location) {
        this._location = v;
    }

    public get hitsNumber(): number {
        return this._hitsNumber;
    }
    public set hitsNumber(v: number) {
        this._hitsNumber = v;
    }


    /**
     * Рисует корабль
     */
    public draw(ctx: CanvasRenderingContext2D | null) {

        let rw, rh: number;

        if (ctx) {
            ctx.save();
            ctx.strokeStyle = "black";
            ctx.lineWidth = 2;

            let gcw: number = GameStore.getters.getGridCellWidth;
            let gch: number = GameStore.getters.getGridCellHeight;

            if (this._type === ShipOrientation.Horizontal) {
                rw = this._length * gcw;
                rh = gch;

            } else {
                rw = gcw;
                rh = this._length * gch;
            };

            this.drawBulkhead(ctx);

            ctx.strokeRect(this._location.x * gcw + 1, this._location.y * gch + 1, rw - 2, rh - 2);
            ctx.restore();
        }
    };
    /**
     * Рисует перемычки корабля
     */
    private drawBulkhead(ctx: CanvasRenderingContext2D | null) {
        if (ctx) {
            ctx.beginPath();
            for (let i = 1; i < this._length; i++) {

                let gcw: number = GameStore.getters.getGridCellWidth;
                let gch: number = GameStore.getters.getGridCellHeight;

                let x0 = this._location.x * gcw;
                let y0 = this._location.y * gch;

                if (this._type === ShipOrientation.Horizontal) {
                    ctx.moveTo(x0 + i * gcw, y0);
                    ctx.lineTo(x0 + i * gcw, y0 + gch);
                }
                else /* if (this._type === ShipType.Vertical) */ {
                    ctx.moveTo(x0, y0 + i * gch);
                    ctx.lineTo(x0 + gcw, y0 + i * gch);
                }

            };
            ctx.stroke();
        }
    };
    /**
     * Меняет тип корабля
     */
    public changeOrientation() {
        if (this._type === ShipOrientation.Horizontal)
            this._type = ShipOrientation.Vertical;
        else
            this._type = ShipOrientation.Horizontal;
    };
    /**
     * Возвращает множество координат (локаций), принадлежащих данному кораблю
     */
    public getLocations(): Location[] {
        // Сразу добавляем координату первой (головной) клетки корабля
        // т.к. она будет общей как для горизонтального, так и для вертикального корабля
        let locations: Location[] = [this._location];

        if (this._type === ShipOrientation.Horizontal)
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