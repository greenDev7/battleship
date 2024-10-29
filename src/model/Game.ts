import Ship from "./Ship";

export default class Game {
    ships: Ship[];

    constructor() {
        console.log('Game constructor invocation...');
        this.ships = this.createInitialShips();
    }

    private createInitialShips(): Ship[] {
        let ships: Ship[] = new Array<Ship>();

        return ships;
    }
}