import Ship from "./Ship";
import ShipOrientation from "./enums/ShipOrientation";
import Location from "./Location";
import { GameStore } from "@/store/modules/GameStore";

export default class Game {

    public static ships: Ship[] = Game.createInitialShips();
    public static shotHistory: Location[] = [];

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
    }
    /**
     * Возвращает true, если локация уже существует в истори выстрелов (shotHistory), иначе false
     */
    public static existsInShotHistory(location: Location): boolean {
        return this.containsLocation(location, Game.shotHistory);
    }
    /**
     * Расставляет случайным образом корабли на сетке
     */
    private static createInitialRandomShips() {

    }
    /**
     * Возвращает true, если корабли расставлены корректно (ни один из них не пересекается со всеми другими),
     * иначе возвращает false и массив с координатами пересечений
     */
    public static isArrangementCorrect(): [boolean, Location[] | undefined] {

        let intersections: Location[] = [];

        for (let i = 0; i < Game.ships.length - 1; i++) {
            const outerShip = Game.ships[i];

            for (let j = i + 1; j < Game.ships.length; j++) {
                const innerShip = Game.ships[j];
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
    public static getShipByHeadLocation(location: Location): Ship | undefined {
        return Game.ships.find(s => (s.location.x === location.x && s.location.y === location.y));
    }
    /**
     * Возвращает корабль по данной локации
     */
    public static getShipByLocation(location: Location): Ship | undefined {

        let notDestroyedShips: Ship[] = Game.ships.filter(s => s.hitsNumber < s.length);

        for (const ship of notDestroyedShips)
            if (Game.containsLocation(location, ship.getLocations()))
                return ship;

        return undefined;
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
    public static async drawShips(ctx: CanvasRenderingContext2D) {
        ctx.save();

        const st = GameStore.state;
        let cw: number = GameStore.getters.getCanvasWidth(st);
        let ch: number = GameStore.getters.getCanvasHeight(st);

        ctx.clearRect(0, 0, cw, ch);
        this.makeGrid(ctx);

        for (const ship of Game.ships)
            await ship.draw(ctx);

        ctx.restore();
    }
    /**
    * Возвращает true, если массив locations содержит локацию loc, иначе false
    */
    public static containsLocation(loc: Location, locations: Location[]): boolean {
        for (const l of locations)
            if (l.x === loc.x && l.y === loc.y)
                return true;
        return false;
    }
    /**
     * Возвращает соседние диагональные локации по отношению к данной
     */
    public static getDiagonalLocations(location: Location): Location[] {

        let diagonalLocs: Location[] = [];

        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {

                let neighborX = location.x + i;
                let neighborY = location.y + j;

                if (i === 0 || j === 0 || neighborX < 0 || neighborY < 0 || neighborX > 9 || neighborY > 9)
                    continue;

                diagonalLocs.push(new Location(neighborX, neighborY));
            }
        }

        return diagonalLocs;
    }
    /**
     * Возвращает true, если все корабли потоплены, иначе false
     */
    public static allShipsAreSunk(): boolean {
        return Game.ships.every(ship => ship.length === ship.hitsNumber);
    }
    /**
     * Подсвечивает диагональные локации и, если нужно, добавляет их в историю выстрелов
     */
    public static highlightDiagonalsAndPushToHistory(
        ctx: CanvasRenderingContext2D,
        shot: Location,
        pushToHistory: boolean = false
    ) {
        for (const loc of Game.getDiagonalLocations(shot)) {
            loc.highlight(ctx);
            if (pushToHistory) Game.shotHistory.push(loc);
        }
    }
}