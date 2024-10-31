import Location from "./Location";
import ShipType from "./ShipType";

export default class Ship {
    length: number;
    type: ShipType;
    loc: Location;

    constructor(length: number, type: ShipType, loc: Location) {
        this.length = length;
        this.type = type;
        this.loc = loc;
    }

    /**
     * createShip
     */
    public static createShip(length: number, type: ShipType, x: number, y: number): Ship {
        return new Ship(length, type, new Location(x, y));
    }

    /**
     * Перемещает корабль вверх на одну клетку
     */
    public moveUp = () => { this.loc.y--; };

    /**
     * Перемещает корабль вверх на одну клетку
     */
    public moveDown = () => { this.loc.y++; };

    /**
     * Перемещает корабль влево на одну клетку
     */
    public moveLeft = () => { this.loc.x--; };

    /**
     * Перемещает корабль вправо на одну клетку
     */
    public moveRight = () => { this.loc.x++ };

}