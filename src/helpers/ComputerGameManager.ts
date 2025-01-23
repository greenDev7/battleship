import GameState from "@/model/enums/GameState";
import HighlightType from "@/model/enums/HighlightType";
import Game from "@/model/Game";
import Location from "@/model/Location";
import Ship from "@/model/Ship";
import { ShipType } from "@/model/WSDataTransferRoot";
import GameStore from "@/store/index";

export default class ComputerGameManager {

    private static possibleShootingLocations: boolean[];

    public static async computerShot() {
        console.log('Computer move');
        let len = ComputerGameManager.possibleShootingLocations.filter(x => x).length;
        console.log('psl array length:', len);
        let randIndex: number = Math.floor(Math.random() * len);
        console.log('randIndex:', randIndex);
        let shot: Location = new Location(randIndex % 10, Math.floor(randIndex / 10));
        console.log('computer shoots at:', shot.toString());

        let ht: HighlightType = HighlightType.CIRCLE;
        let ctx = GameStore.getters.getContext2D;

        let ship: Ship | undefined = Game.getShipByLocation(Game.getShips(), shot);

        if (ship) {
            await GameStore.dispatch("disableShooting");

            ht = HighlightType.CROSS; // меняем тип выделения на "крест"
            ship.hitsNumber++; // увеличиваем счетчик ранений у подбитого корабля
            // находим диагональные локации
            let diags: Location[] = Game.getDiagonalLocations(shot);
            // Исключаем диагональные локации из возможных для выстрела
            await ComputerGameManager.excludeLocationsFromPossible(diags);
            // подсвечиваем диагональные локации
            await Game.highlightDiagonals(ctx, diags);

            // если корабль потоплен
            if (ship.hitsNumber === ship.length) {
                // находим боковые локации
                let edgeLocs = await Ship.getFrontAndBackLocations(
                    ship.length,
                    ship.location.x,
                    ship.location.y,
                    ship.type
                );
                // выделяем их на своем гриде
                for (const loc of edgeLocs) await loc.highlight(ctx);
                // Исключаем боковые локации из возможных для выстрела
                await ComputerGameManager.excludeLocationsFromPossible(edgeLocs);
                // Если все корабли потоплены - игра окончена
                if (Game.allShipsAreSunk()) {
                    GameStore.commit("setMyState", GameState.GAME_IS_OVER);
                    GameStore.commit("setEnemyState", GameState.GAME_IS_OVER);
                }
            }

        } else await GameStore.dispatch("enableShooting");

        await shot.highlight(ctx, ht);
        ComputerGameManager.possibleShootingLocations[randIndex] = false;
        GameStore.commit("setEnemyShotHint", shot.toString());
    }
    public static playerShot(shot: Location) {
        console.log('Player move');
        

    }

    /**
     * Создает массив возможных локаций, куда компьютер может стрелять
     */
    public static createPossibleLocations() {
        console.log('creating possible locations...');
        ComputerGameManager.possibleShootingLocations = [];
        for (let i = 0; i < 100; i++)
            ComputerGameManager.possibleShootingLocations.push(true);
    }
    /**
     * Исключает локации из возможных, чтобы компьютер по ним уже не стрелял
     */
    private static async excludeLocationsFromPossible(locs: Location[]) {
        for (const loc of locs)
            ComputerGameManager.possibleShootingLocations[loc.y * 10 + loc.x] = false;
    }
}