import { GameStore } from "@/store/modules/GameStore";
import HighlightType from "./enums/HighlightType";
import { letterDict } from "@/helpers/LetterDict";


export default class Location {
    private _x: number;
    private _y: number;

    constructor(_x: number, _y: number) {
        this._x = _x;
        this._y = _y;
    }

    public get x(): number {
        return this._x;
    }
    public set x(v: number) {
        this._x = v;
    }
    public get y(): number {
        return this._y;
    }
    public set y(v: number) {
        this._y = v;
    }

    /**
     * Возвращает локацию по координате игрового поля
     */
    public static getLocationByOffsetXY(offsetX: number, offsetY: number): Location {

        const st = GameStore.state;
        let gcw: number = GameStore.getters.getGridCellWidth(st);
        let gch: number = GameStore.getters.getGridCellHeight(st);

        let currentX = Math.floor(offsetX / gcw);
        let currentY = Math.floor(offsetY / gch);

        return new Location(currentX, currentY);
    }
    /**
     * Подсвечивает на канвасе расположение данной локации
     */
    public async highlight(ctx: CanvasRenderingContext2D | null, highlightType: HighlightType = HighlightType.CIRCLE) {
        if (ctx) {

            const st = GameStore.state;
            let gcw: number = GameStore.getters.getGridCellWidth(st);
            let gch: number = GameStore.getters.getGridCellHeight(st);

            ctx.save();

            if (highlightType === HighlightType.SQUARE) {
                ctx.fillStyle = "rgb(229 22 35)";
                ctx.fillRect(this._x * gcw + 3, this._y * gch + 3, gcw - 6, gch - 6);
            }
            else if (highlightType === HighlightType.CIRCLE) {
                ctx.fillStyle = "rgb(33 22 235)";

                const circle = new Path2D();
                let sp = GameStore.state.scaleParameter;

                circle.arc(this._x * gcw + 0.5 * gcw, this._y * gch + 0.5 * gch, 5 * sp, 0, 2 * Math.PI);
                ctx.fill(circle);
            } else {
                // Рисуем крестик
                ctx.strokeStyle = "rgb(229 22 35)";
                ctx.lineWidth = 3;

                ctx.beginPath();
                ctx.moveTo(this._x * gcw + 5, this._y * gch + 5);
                ctx.lineTo((this._x + 1) * gcw - 5, (this._y + 1) * gch - 5);

                ctx.moveTo((this._x + 1) * gcw - 5, this._y * gch + 5);
                ctx.lineTo(this._x * gcw + 5, (this._y + 1) * gch - 5);

                ctx.stroke();
            }

            ctx.restore();
        }
    }
    /**
     * Возвращает true, если локация находится за пределами сетки, иначе false
     */
    public outsideTheGrid(): boolean {
        return this._x < 0 || this._x > 9 || this._y < 0 || this._y > 9
    }
    /**
     * Возвращает true, если локация валидна, иначе false
     */
    public isValid(): boolean {
        // Бывают случаи, когда игрок делает выстрел по невалидной локации 
        // (вне границ сетки, например, по координате а-0)
        return (this._x >= 0 && this._x <= 9 && this._y >= 0 && this._y <= 9)
    }
    /**
     * Возвращает координату в ее текстовом представлении, например (к-7)
     */
    public toString = () => `(${letterDict[this._x]}-${this._y + 1})`;

    /**
     * Возвращает смежные (недиагональные) локации по отношению к данной
     */
    public static async getNearbyLocations(loc_x: number, loc_y: number) {
        let nearbyLocs: Location[] = [];

        for (let i = -1; i <= 1; i++)
            for (let j = -1; j <= 1; j++) {

                let neighborX = loc_x + i;
                let neighborY = loc_y + j;

                // проверка, что локации НЕдиагональные и не выходят за рамки грида
                if ((i * i + j * j !== 1) || neighborX < 0 || neighborY < 0 || neighborX > 9 || neighborY > 9)
                    continue;

                nearbyLocs.push(new Location(neighborX, neighborY));
            }

        return nearbyLocs;
    }
    /**
     * Возвращает порядковое представление локации. Например, для локации б-2 возвращает 11 
     */
    public convertToSequenceNumber(): number {
        return this._y * 10 + this._x;
    }
}