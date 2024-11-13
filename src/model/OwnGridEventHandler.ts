import Location from '@/model/Location';
import Ship from './Ship';
import ShipType from './ShipType';
import Game from './Game';

export default class name {

    private _ctx: CanvasRenderingContext2D;
    private _selectedShip?: Ship = new Ship(1, ShipType.Horizontal, new Location(0, 0));

    constructor(_ctx: CanvasRenderingContext2D) {
        console.log('constructor:', _ctx);
        this._ctx = _ctx;
    }

    /**
     * register
     */
    public register() {
        console.log('register:', this._ctx);
        console.log('register canvas:', this._ctx.canvas);
        this._ctx.canvas.addEventListener('mousedown', this.handleMouseDown, false);
        this._ctx.canvas.addEventListener('mousemove', this.ggg, false);
    }

    private handleMouseDown(event: MouseEvent) {

        console.log('handleMouseDown:', this._ctx);
        console.log('event target:', event.target);

        let loc: Location = Location.getLocationByOffsetXY(event.offsetX, event.offsetY);
        this._selectedShip = Game.getShipByLocation(loc);

        if (this._selectedShip) {

            if (event.target) {

                // event.target.addEventListener('mousemove', this.ggg);

                console.log('(Mouse Down) Current location: ', loc);
                console.log('(Mouse Down) Selected ship: ', this._selectedShip);
            }
        }
    }

    private ggg(event: MouseEvent) {
        let loc: Location = Location.getLocationByOffsetXY(event.offsetX, event.offsetY);

        if (this._selectedShip) {
            this._selectedShip.location = loc;
            Game.drawShips(this._ctx);
        }
    }
}