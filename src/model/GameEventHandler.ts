import Location from "./Location";

export default class GameEventHandler {

    constructor() { }

    /**
     * onMouseDownHandler
     */
    public static onMouseDownHandler(event: MouseEvent) {
        event.preventDefault();
        // let loc: Location = Location.getLocationByOffsetXY(event.offsetX, event.offsetY, gridCellWidth, gridCellHeight);
        // console.log('Current location: ', loc);
        // console.log('selected ship: ', this.getShipByLocation(loc));
    }
}