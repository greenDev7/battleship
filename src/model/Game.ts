import Ship from "./Ship";
import ShipType from "./ShipType";

export default class Game {

    constructor() {
        console.log('Game constructor invocation...');
        console.log('Default arrangement...');
    }

    /**
     * createDefaultShips
    */
    public static createInitialShips(): Ship[] {
        return [
            Ship.createShip(1, ShipType.Horizontal, 8, 2),
            Ship.createShip(1, ShipType.Horizontal, 0, 9),
            Ship.createShip(1, ShipType.Horizontal, 7, 5),
            Ship.createShip(1, ShipType.Horizontal, 8, 8),

            Ship.createShip(2, ShipType.Horizontal, 0, 0),
            Ship.createShip(2, ShipType.Vertical, 4, 3),
            Ship.createShip(2, ShipType.Vertical, 1, 2),

            Ship.createShip(3, ShipType.Horizontal, 5, 0),
            Ship.createShip(3, ShipType.Horizontal, 4, 9),

            Ship.createShip(4, ShipType.Vertical, 2, 6)
        ]
    };

    /**
     * Расставляет случайным образом корабли на сетке
     */
    public createInitialRandomShips() {
        
    }
}