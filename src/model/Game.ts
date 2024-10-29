import Point2D from "./Point2D";
import Ship from "./Ship";

export default class Game {
    ships: Ship[];

    constructor() {
        console.log('Game constructor invocation...');
        this.ships = this.createInitialShips();
    }

    private createInitialShips(): Ship[] {
        let ships: Ship[] = new Array<Ship>();

        let ship2type1Structure: Point2D[] = [new Point2D(0, 0), new Point2D(1, 0)];
        let ship2type2Structure: Point2D[] = [new Point2D(0, 0), new Point2D(0, 1)];

        ships.push(new Ship(ship2type1Structure));
        ships.push(new Ship(ship2type2Structure));

        return ships;
    }
}