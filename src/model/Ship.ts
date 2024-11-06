import Location from "./Location";
import ShipType from "./ShipType";


export default class Ship {
    length: number;
    type: ShipType;
    location: Location;

    constructor(length: number, type: ShipType, location: Location) {
        this.length = length;
        this.type = type;
        this.location = location;
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

        if (this.type === ShipType.Horizontal) {
            rw = this.length * gridCellWidth;
            rh = gridCellHeight;
        } else {
            rw = gridCellWidth;
            rh = this.length * gridCellHeight;
        };

        if (ctx) {
            ctx.save();
            ctx.strokeStyle = "black";
            ctx.lineWidth = 2;
            ctx.strokeRect(this.location.x * gridCellWidth + 1, this.location.y * gridCellHeight + 1, rw - 2, rh - 2);
            ctx.restore();
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
    }

    /**
     * Перемещает корабль вверх на одну клетку
     */
    public moveUp = () => { this.location.y--; };

    /**
     * Перемещает корабль вверх на одну клетку
     */
    public moveDown = () => { this.location.y++; };

    /**
     * Перемещает корабль влево на одну клетку
     */
    public moveLeft = () => { this.location.x--; };

    /**
     * Перемещает корабль вправо на одну клетку
     */
    public moveRight = () => { this.location.x++ };
}