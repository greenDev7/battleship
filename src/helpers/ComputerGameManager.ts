import GameState from "@/model/enums/GameState";
import HighlightType from "@/model/enums/HighlightType";
import Game from "@/model/Game";
import Location from "@/model/Location";
import Ship from "@/model/Ship";
import GameStore from "@/store/index";

export default class ComputerGameManager {

    private static availableLocations: boolean[];

    public static async computerShot() {

        let ship: Ship | undefined;

        do {
            console.log('Computer move');
            // Формируем массив с индексами элементов availableLocations, у которых значения равны true
            let indexesOfTrue = ComputerGameManager.availableLocations.reduce(function (arr: number[], e, i) { if (e) arr.push(i); return arr; }, []);
            let randIndex = Math.floor(Math.random() * indexesOfTrue.length);
            console.log('randIndex:', randIndex);
            let shot: Location = new Location(indexesOfTrue[randIndex] % 10, Math.floor(indexesOfTrue[randIndex] / 10));
            console.log('computer shoots at:', shot.toString());

            let ht: HighlightType = HighlightType.CIRCLE;
            let ctx = GameStore.getters.getContext2D;

            ship = Game.getShipByLocation(Game.getShips(), shot);

            if (ship) {
                // Если компьютер попал - отключаем у соперника возможность выстрела
                await GameStore.dispatch("disableShooting");

                ht = HighlightType.CROSS; // меняем тип выделения на "крест"
                ship.hitsNumber++; // увеличиваем счетчик ранений у подбитого корабля
                // находим диагональные локации
                let diags: Location[] = Game.getDiagonalLocations(shot);
                console.log('diags:', diags);
                // Исключаем диагональные локации из возможных для выстрела
                await ComputerGameManager.excludeLocations(diags);
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
                    await ComputerGameManager.excludeLocations(edgeLocs);
                    // Если все корабли потоплены - игра окончена, компьютер выиграл
                    if (Game.allShipsAreSunk(Game.getShips())) {
                        GameStore.commit("setMyState", GameState.GAME_IS_OVER);
                        GameStore.commit("setEnemyState", GameState.GAME_IS_OVER);
                    }
                }

            } else await GameStore.dispatch("enableShooting");

            await shot.highlight(ctx, ht);
            ComputerGameManager.availableLocations[indexesOfTrue[randIndex]] = false;
            GameStore.commit("setEnemyShotHint", shot.toString());

        } while (ship)
    }
    public static async playerShot(shot: Location) {
        console.log('Player move');

        Game.addToShotHistory(shot);

        let ht: HighlightType = HighlightType.CIRCLE;
        let hostileCtx = GameStore.getters.getHostileContext2D;

        let ship: Ship | undefined = Game.getShipByLocation(Game.getComputerShips(), shot);

        if (ship) {
            ht = HighlightType.CROSS; // меняем тип выделения на "крест"
            ship.hitsNumber++; // увеличиваем счетчик ранений у подбитого корабля
            // находим диагональные локации
            let diags: Location[] = Game.getDiagonalLocations(shot);
            // добавляем диагональные локации в историю выстрелов
            for (const loc of diags) Game.addToShotHistory(loc);
            // подсвечиваем диагональные локации
            await Game.highlightDiagonals(hostileCtx, diags);

            // если корабль потоплен
            if (ship.hitsNumber === ship.length) {
                // находим боковые локации
                let edgeLocs = await Ship.getFrontAndBackLocations(
                    ship.length,
                    ship.location.x,
                    ship.location.y,
                    ship.type
                );
                // добавляем боковые локации в историю выстрелов
                for (const loc of edgeLocs) Game.addToShotHistory(loc);
                // выделяем их
                for (const loc of edgeLocs) await loc.highlight(hostileCtx);

                // Если все корабли компьютера потоплены - игра окончена, игрок выиграл
                if (Game.allShipsAreSunk(Game.getComputerShips())) {
                    GameStore.commit("setMyState", GameState.GAME_IS_OVER);
                    GameStore.commit("setEnemyState", GameState.GAME_IS_OVER);
                    GameStore.commit("setIsWinner", true);
                    console.log("PLAYER WON!");
                }
            }

        } else {
            await GameStore.dispatch("disableShooting");
            await ComputerGameManager.computerShot();
        }

        await shot.highlight(hostileCtx, ht);
    }
    /**
     * Создает массив доступных локаций, куда компьютер может стрелять
     */
    public static createAvailableLocations() {
        console.log('creating available locations...');
        ComputerGameManager.availableLocations = [];
        for (let i = 0; i < 100; i++)
            ComputerGameManager.availableLocations.push(true);
    }
    /**
     * Исключает локации из доступных, чтобы компьютер по ним уже не стрелял
     */
    private static async excludeLocations(locs: Location[]) {
        for (const loc of locs)
            ComputerGameManager.availableLocations[loc.y * 10 + loc.x] = false;
    }
}