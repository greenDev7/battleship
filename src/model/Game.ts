import Ship from "./Ship";
import ShipType from "./ShipType";
import Location from "./Location";

export default class Game {

    constructor() {
        console.log('Game constructor invocation...');
    };

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

    };

    /**
     * Возвращает true, если корабли расставлены корректно (ни один из них не пересекается со всеми другими),
     * иначе возвращает false и массив с координатами пересечений
     */
    public static isArrangementCorrect(ships: Ship[]): [boolean, Location[] | undefined] {

        let intersections: Location[] = [];

        for (let i = 0; i < ships.length - 1; i++) {
            const outerShip = ships[i];

            for (let j = i + 1; j < ships.length; j++) {
                const innerShip = ships[j];
                const res = outerShip.isIntersect(innerShip);
                if (res[0])
                    Array.prototype.push.apply(intersections, [res[1], res[2]]);
            };
        };

        if (intersections.length > 0)
            return [false, intersections];

        return [true, undefined];
    }
}