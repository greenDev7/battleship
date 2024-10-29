import ShipType from "./ShipType";

export default class Ship {
    size: number;
    type: ShipType;

    constructor(size: number, type: ShipType) {
        this.size = size;
        this.type = type;
    }

}