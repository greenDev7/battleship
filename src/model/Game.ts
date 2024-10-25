import Ship from "./Ship";


class Game {
    ships: Ship[];

    constructor() {
        let ships: Ship[] = new Array<Ship>(4);

        ships.push(new Ship(1));
        ships.push(new Ship(1));
        ships.push(new Ship(1));
        ships.push(new Ship(1));

        ships.push(new Ship(2));
        ships.push(new Ship(2));
        ships.push(new Ship(2));

        ships.push(new Ship(3));
        ships.push(new Ship(3));

        ships.push(new Ship(4));

        this.ships = ships;
    }
}