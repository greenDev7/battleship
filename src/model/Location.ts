import { GameStore } from "@/store/modules/GameStore";
import HighlightType from "./enums/HighlightType";
import { letterDict } from "@/helpers/LetterDict";
import cross2 from "@/assets/cross2.png";

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
    public highlight(ctx: CanvasRenderingContext2D | null, highlightType: HighlightType = HighlightType.CIRCLE) {
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
                let img = new Image();
                img.src = cross2;
                img.onload = () => (ctx.drawImage(img, 0, 0, img.width, img.height, this._x * gcw + 3, this._y * gch + 3, gcw - 6, gch - 6));
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
     * Возвращает координату в ее текстовом представлении, например (к-7)
     */
    public toString = () => `(${letterDict[this._x]}-${this._y + 1})`;
}