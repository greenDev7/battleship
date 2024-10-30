import Position from "./Position";
import ShipType from "./ShipType";

export default class ShipLocation {
    position: Position;
    type: ShipType;
    size: number;

    constructor(position: Position, type: ShipType, size: number) {
        this.position = position;
        this.type = type;
        this.size = size;
    };

    /**
     * createShipLocation
     */
    public static createShipLocation = (x: number, y: number, type: ShipType, size: number): ShipLocation => {
        return new ShipLocation(new Position(x, y), type, size)
    }

    /**
     * createRandomShipLocation
     */
    public createRandomShipLocation() {

    };
}