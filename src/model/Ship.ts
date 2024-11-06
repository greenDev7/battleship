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
    }

    public get length(): number {
        return this._length;
    }
    public set length(v: number) {
        this._length = v;
    }

    public get type(): ShipType {
        return this._type;
    }
    public set type(v: ShipType) {
        this._type = v;
    }

    public get location(): Location {
        return this._location;
    }
    public set location(v: Location) {
        this._location = v;
    }

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

            if (this.type === ShipType.Horizontal) {
                rw = this.length * gridCellWidth;
                rh = gridCellHeight;

            } else {
                rw = gridCellWidth;
                rh = this.length * gridCellHeight;
            };

            this.drawBulkhead(ctx, gridCellWidth, gridCellHeight);

            ctx.strokeRect(this.location.x * gridCellWidth + 1, this.location.y * gridCellHeight + 1, rw - 2, rh - 2);
            ctx.restore();
        }
    };
    private drawBulkhead(ctx: CanvasRenderingContext2D | null, gridCellWidth: number, gridCellHeight: number) {
        if (ctx) {
            ctx.beginPath();
            for (let i = 1; i < this.length; i++) {

                let x0 = this.location.x * gridCellWidth;
                let y0 = this.location.y * gridCellHeight;

                if (this.type === ShipType.Horizontal) {
                    ctx.moveTo(x0 + i * gridCellWidth, y0);
                    ctx.lineTo(x0 + i * gridCellWidth, y0 + gridCellHeight);
                }
                else /* if (this.type === ShipType.Vertical) */ {
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
        if (this.type === ShipType.Horizontal)
            this.type = ShipType.Vertical;
        else
            this.type = ShipType.Horizontal;
    };
}