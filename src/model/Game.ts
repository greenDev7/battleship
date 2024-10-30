import ShipLocation from "./ShipLocation";
import ShipType from "./ShipType";

export default class Game {

    constructor() {
        console.log('Game constructor invocation...');
        console.log('Default arrangement...');
    }

    /**
     * createDefaultShipLocations
    */
    public static createDefaultShipLocations(): ShipLocation[] {
        return [
            ShipLocation.createShipLocation(8, 2, ShipType.Horizontal, 1),
            ShipLocation.createShipLocation(0, 9, ShipType.Horizontal, 1),
            ShipLocation.createShipLocation(7, 5, ShipType.Horizontal, 1),
            ShipLocation.createShipLocation(8, 8, ShipType.Horizontal, 1),

            ShipLocation.createShipLocation(0, 0, ShipType.Horizontal, 2),
            ShipLocation.createShipLocation(4, 3, ShipType.Vertical, 2),
            ShipLocation.createShipLocation(1, 2, ShipType.Vertical, 2),

            ShipLocation.createShipLocation(5, 0, ShipType.Horizontal, 3),
            ShipLocation.createShipLocation(4, 9, ShipType.Horizontal, 3),

            ShipLocation.createShipLocation(2, 6, ShipType.Vertical, 4)
        ]
    }
}