import Ship from "./Ship";
import ShipOrientation from "./ShipOrientation";
import Location from "./Location";
import { GameStore } from "@/store/modules/GameStore";

export default class Game {

    public static ships: Ship[] = Game.createInitialShips();

    constructor() {
        console.log('Game constructor invocation...');
    }

    /**
     * createDefaultShips
    */
    private static createInitialShips(): Ship[] {
        return [
            new Ship(1, ShipOrientation.Horizontal, new Location(8, 2)),
            new Ship(1, ShipOrientation.Horizontal, new Location(0, 9)),
            new Ship(1, ShipOrientation.Horizontal, new Location(7, 5)),
            new Ship(1, ShipOrientation.Horizontal, new Location(8, 8)),

            new Ship(2, ShipOrientation.Horizontal, new Location(0, 0)),
            new Ship(2, ShipOrientation.Vertical, new Location(4, 3)),
            new Ship(2, ShipOrientation.Vertical, new Location(1, 2)),

            new Ship(3, ShipOrientation.Horizontal, new Location(5, 0)),
            new Ship(3, ShipOrientation.Horizontal, new Location(4, 9)),

            new Ship(4, ShipOrientation.Vertical, new Location(2, 6))
        ]
    };

    /**
     * Расставляет случайным образом корабли на сетке
     */
    private static createInitialRandomShips() {

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

    /**
     * Возвращает корабль по его координатам
     */
    public static getShipByLocation(location: Location): Ship | undefined {
        return Game.ships.find(s => (s.location.x === location.x && s.location.y === location.y));
    }

    /**
     * Рисует сетку на канвесе
     */
    public static makeGrid(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.beginPath();

        ctx.lineWidth = GameStore.state.gridLineThickness;
        ctx.setLineDash([3, 3]);

        const st = GameStore.state;

        let cw: number = GameStore.getters.getCanvasWidth(st);
        let ch: number = GameStore.getters.getCanvasHeight(st);
        let gcw: number = GameStore.getters.getGridCellWidth(st);
        let gch: number = GameStore.getters.getGridCellHeight(st);

        for (let x = 0; x <= cw; x += gcw) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, ch);
        };

        for (let y = 0; y <= ch; y += gch) {
            ctx.moveTo(0, y);
            ctx.lineTo(cw, y);
        };

        ctx.stroke();
        ctx.restore();
    }

    /**
     * Рисует корабли на канвасе
     */
    public static drawShips(ctx: CanvasRenderingContext2D): void {
        ctx.save();

        const st = GameStore.state;
        let cw: number = GameStore.getters.getCanvasWidth(st);
        let ch: number = GameStore.getters.getCanvasHeight(st);

        ctx.clearRect(0, 0, cw, ch);
        this.makeGrid(ctx);
        Game.ships.forEach(ship => ship.draw(ctx));
        ctx.restore();
    }
}