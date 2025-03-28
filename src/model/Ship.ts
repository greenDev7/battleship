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
    public draw(ctx: CanvasRenderingContext2D | null, strokeColor: string = "black") {

        let rectangleWidth, rectangleHeight: number;

        if (ctx) {
            ctx.save();
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = 2;

            let gcw: number = GameStore.getters.getGridCellWidth;
            let gch: number = GameStore.getters.getGridCellHeight;

            if (this._type === ShipOrientation.Horizontal) {
                rectangleWidth = this._length * gcw;
                rectangleHeight = gch;

            } else {
                rectangleWidth = gcw;
                rectangleHeight = this._length * gch;
            };

            this.drawBulkhead(ctx);

            ctx.strokeRect(this._location.x * gcw + 1, this._location.y * gch + 1, rectangleWidth - 2, rectangleHeight - 2);
            ctx.restore();
        }
    }
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
    }
    /**
     * Меняет тип корабля
     */
    public changeOrientation() {
        if (this._type === ShipOrientation.Horizontal)
            this._type = ShipOrientation.Vertical;
        else
            this._type = ShipOrientation.Horizontal;
    }
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
    }
    /**
     * Возвращает торцевые локации корабля (в случае потопления корабля их необходимо подсветить)
     */
    public static async getFrontAndBackLocations(length: number, loc_x: number, loc_y: number, shipType: number): Promise<Location[]> {

        if (length === 1)
            // если корабль однопалубный, то возвращаем смежные (недиагональные) локации
            return await Location.getNearbyLocations(loc_x, loc_y);
        else {

            let locs: Location[] = [];

            if (shipType === ShipOrientation.Horizontal) {
                let leftLoc = new Location(loc_x - 1, loc_y);
                let rightLoc = new Location(loc_x + length, loc_y);

                if (leftLoc.x >= 0) locs.push(leftLoc);
                if (rightLoc.x <= 9) locs.push(rightLoc);
            }
            else {
                let topLoc = new Location(loc_x, loc_y - 1);
                let bottomLoc = new Location(loc_x, loc_y + length);

                if (topLoc.y >= 0) locs.push(topLoc);
                if (bottomLoc.y <= 9) locs.push(bottomLoc);
            }

            return locs;
        }
    }
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