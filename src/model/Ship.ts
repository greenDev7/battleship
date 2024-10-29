import Point2D from "./Point2D";

export default class Ship {

    private _shipStructure: Point2D[]

    constructor(shipStructure: Point2D[]) {
        this._shipStructure = shipStructure;
    }

    public get shipStructure(): Point2D[] {
        return this._shipStructure;
    }

}