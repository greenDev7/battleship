import HighlightType from "@/model/enums/HighlightType";
import Game from "@/model/Game";
import Location from "@/model/Location";
import Ship from "@/model/Ship";
import GameStore from "@/store/index";

export default class ComputerGameManager {

    private static possibleShootingLocations: Location[];
    

    public static computerShot() {
        console.log('Computer move');

        let shotLocation: Location = new Location(Math.floor(Math.random() * 10), Math.floor(Math.random() * 10));
        console.log('computer shoots at:', shotLocation.toString());

        let ht: HighlightType = HighlightType.CIRCLE;
        let ctx = GameStore.getters.getContext2D;

        let ship: Ship | undefined = Game.getShipByLocation(Game.getShips(), shotLocation);

        if (ship) {
            console.log('Computer hit');
        }
    }
    public static playerShot() {
        console.log('Player move');
    }
}