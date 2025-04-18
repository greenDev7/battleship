import GameState from "@/model/enums/GameState";
import HighlightType from "@/model/enums/HighlightType";
import Game from "@/model/Game";
import Location from "@/model/Location";
import Ship from "@/model/Ship";
import GameStore from "@/store/index";

export default class ComputerGameManager {

    private static availableLocations: boolean[];
    private static currentHit: Location | undefined = undefined;
    private static numberOfMissesBeforeCheating: number = 10;
    private static numberOfMisses: number = 0;

    public static async computerShot() {

        let ship: Ship | undefined = undefined;

        do {
            // Формируем выстрел компьютера
            let shot: Location;

            console.log('numberOfMisses: ', ComputerGameManager.numberOfMisses);

            // Если компьютер промахивается numberOfMissesBeforeCheating раз, придется читерить =)
            // и подсказывать компьютеру локацию где находится корабль игрока. 
            // При этом у игрока должен быть хотя бы один целый и невредимый корабль (hitsNumber === 0)
            if (ComputerGameManager.numberOfMisses === ComputerGameManager.numberOfMissesBeforeCheating && Game.getShips().some(s => s.hitsNumber === 0)) {
                console.log("Sorry, player, but I'm peeping...");
                let peepedLocation = ComputerGameManager.getExactLocation();
                if (peepedLocation)
                    shot = peepedLocation;
                else
                    shot = ComputerGameManager.getRandomLocationFromAvailables();
            }
            else {

                let ch = ComputerGameManager.currentHit;
                if (ch) {
                    // Если имеется раненный корабль игрока, то нужно попытаться сначала его добить
                    console.log('killing damaged ship: ', ComputerGameManager.currentHit);
                    // При этом нужно попробовать выбрать из доступных локаций те, которые будут соседними по отношению к текущему попаданию
                    let nearbyLocs = await Location.getNearbyLocations(ch.x, ch.y);
                    // и из этих локации выбираем одну рандомную (если она существует)
                    let nearRandomLoc = ComputerGameManager.getRandomLocationFromNearby(nearbyLocs);

                    if (nearRandomLoc)
                        shot = nearRandomLoc;
                    else {
                        shot = ComputerGameManager.getRandomLocationFromAvailables();
                        ComputerGameManager.currentHit = undefined;
                    }
                }
                else shot = ComputerGameManager.getRandomLocationFromAvailables();
            }

            console.log('Computer shoots at:', shot.toString());

            let ht: HighlightType = HighlightType.CIRCLE;
            let ctx = GameStore.getters.getContext2D;

            ship = Game.getShipByLocation(Game.getShips(), shot);

            if (ship) {
                // Если компьютер попал - отключаем у соперника возможность выстрела
                await GameStore.dispatch("disableShooting");
                // Обнуляем счетчик промахов
                ComputerGameManager.numberOfMisses = 0;
                // Сохраняем попадание в currentHit
                ComputerGameManager.currentHit = shot;

                ht = HighlightType.CROSS; // меняем тип выделения на "крест"
                ship.hitsNumber++; // увеличиваем счетчик ранений у подбитого корабля
                // находим диагональные локации
                let diags: Location[] = Game.getDiagonalLocations(shot);
                // Исключаем диагональные локации из доступных для выстрела
                await ComputerGameManager.excludeLocations(diags);
                // подсвечиваем диагональные локации
                await Game.highlightDiagonals(ctx, diags);

                // если корабль потоплен
                if (ship.hitsNumber === ship.length) {
                    // сбрасываем currentHit
                    ComputerGameManager.currentHit = undefined;
                    // находим боковые локации
                    let edgeLocs = await Ship.getFrontAndBackLocations(
                        ship.length,
                        ship.location.x,
                        ship.location.y,
                        ship.type
                    );
                    // выделяем их на своем гриде
                    for (const loc of edgeLocs) await loc.highlight(ctx);
                    // Исключаем боковые локации из доступных для выстрела
                    await ComputerGameManager.excludeLocations(edgeLocs);
                    // Если все корабли потоплены - игра окончена, компьютер выиграл
                    if (Game.allShipsAreSunk(Game.getShips())) {
                        GameStore.commit("setMyState", GameState.GAME_IS_OVER);
                        GameStore.commit("setEnemyState", GameState.GAME_IS_OVER);

                        await shot.highlight(ctx, ht);
                        let hostileCtx = GameStore.getters.getHostileContext2D;
                        // Показываем игроку местонахождение непотопленных кораблей компьютера
                        Game.getComputerShips().filter(s => s.hitsNumber < s.length).forEach(s => s.draw(hostileCtx, 'red'));
                        break;
                    }
                }

            } else {
                await GameStore.dispatch("enableShooting");
                // Если компьютер промазал, увеличиваем счетчик промахов
                ComputerGameManager.numberOfMisses++;
            }

            await shot.highlight(ctx, ht);
            GameStore.commit("setEnemyShotHint", shot.toString());
            // Исключаем выстрел из доступных локаций
            ComputerGameManager.excludeLocation(shot);
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
                    await GameStore.dispatch("disableShooting");
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
     * Возвращает локацию, принадлежащую целому и невредимому кораблю
     */
    private static getExactLocation(): Location | undefined {
        // получим целый и невредимый корабль
        let ship = Game.getShips().find(s => s.hitsNumber === 0);
        if (ship)
            return ship.getLocations()[0];
        
        return undefined;
    }
    /**
     * Возвращает одну рандомную локацию из доступных 
     */
    private static getRandomLocationFromAvailables(): Location {
        // Формируем массив с индексами элементов availableLocations, у которых значения равны true
        let indexesOfTrue = ComputerGameManager.availableLocations.reduce(function (arr: number[], el, index) { if (el) arr.push(index); return arr; }, []);
        let randIndex = Math.floor(Math.random() * indexesOfTrue.length);
        return new Location(indexesOfTrue[randIndex] % 10, Math.floor(indexesOfTrue[randIndex] / 10));
    }
    private static getRandomLocationFromNearby(nearbyLocs: Location[]): Location | undefined {

        let availableLocs: Location[] = [];

        for (const loc of nearbyLocs)
            if (ComputerGameManager.isAvailableLocation(loc))
                availableLocs.push(loc);

        if (availableLocs.length === 0)
            return undefined;

        let randomIndex = Math.floor(Math.random() * availableLocs.length);
        let loc: Location = availableLocs[randomIndex];
        return loc;
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
            ComputerGameManager.excludeLocation(loc);
    }
    /**
     * Исключает локацию из доступных
     */
    private static excludeLocation(loc: Location) {
        ComputerGameManager.availableLocations[loc.convertToSequenceNumber()] = false;
    }
    /**
     * Возвращает true, если локация доступна для выстрела, иначе false 
     */
    private static isAvailableLocation(loc: Location): boolean {
        return ComputerGameManager.availableLocations[loc.convertToSequenceNumber()];
    }
}