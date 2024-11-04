import Location from "./Location";
import ShipType from "./ShipType";

import ship1 from "../assets/ship1.png"
import ship2Horizontal from "../assets/ship2Horizontal.png";
import ship2Vertical from "../assets/ship2Vertical.png";
import ship3Horizontal from "../assets/ship3Horizontal.png";
import ship3Vertical from "../assets/ship3Vertical.png";
import ship4Horizontal from "../assets/ship4Horizontal.png";
import ship4Vertical from "../assets/ship4Vertical.png";

export default class Ship {
    length: number;
    type: ShipType;
    location: Location;
    imageSourceString: string;

    constructor(length: number, type: ShipType, location: Location) {
        this.length = length;
        this.type = type;
        this.location = location;
        this.imageSourceString = this.determineShipImage();
    };

    private determineShipImage(): string {

        if (this.type === ShipType.Horizontal) {
            if (this.length === 1) return ship1;
            if (this.length === 2) return ship2Horizontal;
            if (this.length === 3) return ship3Horizontal;
            if (this.length === 4) return ship4Horizontal;
        }
        else {
            if (this.length === 2) return ship2Vertical;
            if (this.length === 3) return ship3Vertical;
            if (this.length === 4) return ship4Vertical;
        }

        return "";
    }

    /**
     * createShip
     */
    public static createShip(length: number, type: ShipType, x: number, y: number): Ship {
        return new Ship(length, type, new Location(x, y));
    };

    /**
     * Инициализирует (отрисовывает) корабль на канвасе (ctx). Используется при загрузке компонента (в методе mounted vue-компонента)
     * Для повторной перерисовки кораблей будет использоваться другой метод - reDraw()
     */
    public initializeShipImages(ctx: CanvasRenderingContext2D | null, gridCellWidth: number, gridCellHeight: number, scaleParameter: number) {
        let img = new Image();
        img.src = this.imageSourceString;

        img.onload = () => {
            if (ctx)
                ctx.drawImage(img, this.location.x * gridCellWidth, this.location.y * gridCellHeight, img.width * scaleParameter, img.height * scaleParameter);
        };
    };

    /**
     * Перерисовывает корабль
     */
    public reDraw(ctx: CanvasRenderingContext2D, gridCellWidth: number, gridCellHeight: number, scaleParameter: number) {
        let img = new Image();
        img.src = this.imageSourceString;
        ctx.drawImage(img, this.location.x * gridCellWidth,
            this.location.y * gridCellHeight, img.width * scaleParameter, img.height * scaleParameter);
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