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
    }

    /**
     * createShip
     */
    public static createShip(length: number, type: ShipType, x: number, y: number): Ship {
        return new Ship(length, type, new Location(x, y));
    };

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