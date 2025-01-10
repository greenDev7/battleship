import GameState from "@/model/enums/GameState";
import GameType from "@/model/enums/GameType";
import MessageType from "@/model/enums/MessageType";
import Game from "@/model/Game";
import Location from "@/model/Location";
import { FireResponseType, GameCreationBodyType, ShipType, TransferLevel2Type, UnSunkShipsType, WSDataTransferRootType } from "@/model/WSDataTransferRoot";
import GameStore from "@/store/index";
import WebSocketManager from "./WebSocketManager";
import HighlightType from "@/model/enums/HighlightType";
import ShotResult from "@/model/enums/ShotResult";
import Ship from "@/model/Ship";
import UIHandler from "@/helpers/UIHandler";

export default class GameProcessManager {

    private static currentShot: Location;
    private static enemyClientUuid: string;
    private static gameId: string;

    public static getEnemyUUID() {
        return GameProcessManager.enemyClientUuid;
    }
    public static getGameId() {
        return GameProcessManager.gameId;
    }
    public static async processData(dataFromServer: string) {
        console.log('Data from server was received: ', dataFromServer);

        let parsedData: WSDataTransferRootType = JSON.parse(dataFromServer);

        switch (parsedData.msg_type) {
            case MessageType.GAME_CREATION:
                console.log('MessageType.GAME_CREATION data:', parsedData);
                if (parsedData.is_status_ok)
                    GameProcessManager.processGameCreation(parsedData.data);
                break;

            case MessageType.SHIPS_ARE_ARRANGED:
                console.log('MessageType.SHIPS_ARE_ARRANGED data:', parsedData);
                if (parsedData.is_status_ok)
                    GameProcessManager.processShipArrangement(parsedData.data);
                break;

            case MessageType.PLAY:
                console.log('MessageType.PLAY data:', parsedData);
                if (parsedData.is_status_ok)
                    await GameProcessManager.processStartingToPlay(parsedData.data);
                break;

            case MessageType.FIRE_REQUEST:
                console.log('MessageType.FIRE_REQUEST data:', parsedData);
                if (parsedData.is_status_ok)
                    await GameProcessManager.processFireRequest(parsedData.data);
                break;

            case MessageType.FIRE_RESPONSE:
                console.log('MessageType.FIRE_RESPONSE data:', parsedData);
                if (parsedData.is_status_ok)
                    await GameProcessManager.processFireResponse(parsedData.data);
                break;

            case MessageType.GAME_OVER:
                console.log('MessageType.GAME_OVER data:', parsedData);
                if (parsedData.is_status_ok)
                    await GameProcessManager.processGameOver(parsedData.data);
                break;

            case MessageType.UNSUNK_SHIPS:
                console.log('MessageType.UNSUNK_SHIPS data:', parsedData);
                if (parsedData.is_status_ok)
                    await GameProcessManager.processUnsunkShips(parsedData.data);
                break;

            case MessageType.DISCONNECTION:
                console.log('MessageType.DISCONNECTION data:', parsedData);
                if (parsedData.is_status_ok)
                    await GameProcessManager.processDisconnection(parsedData.data);
                break;

            case MessageType.PLAY_AGAIN:
                console.log('MessageType.PLAY_AGAIN data:', parsedData);
                if (parsedData.is_status_ok)
                    await GameProcessManager.processPlayAgain(parsedData.data);
                break;

            default:
                break;
        }
    }

    public static getGameCreationBody(gameType: GameType, nickName: string, enemyUUID: string): GameCreationBodyType {

        const gameCreationBody: GameCreationBodyType = {
            msg_type: MessageType.GAME_CREATION,
            game_type: gameType,
            nickName: nickName,
        };

        if (gameType === GameType.FRIEND)
            gameCreationBody.friendUUID = enemyUUID;

        return gameCreationBody;
    }
    public static processGameCreation(data: TransferLevel2Type) {
        GameProcessManager.gameId = data.gameId;
        GameStore.commit("setMyState", GameState.SHIPS_POSITIONING);
        GameStore.commit("setEnemyState", GameState.SHIPS_POSITIONING);
        GameStore.commit("setEnemyNickname", data.enemy_nickname);
    }
    private static processShipArrangement(data: TransferLevel2Type) {
        GameStore.commit("setEnemyState", GameState.SHIPS_ARE_ARRANGED);
        GameProcessManager.enemyClientUuid = data.enemy_client_id;
    }
    private static async processStartingToPlay(data: TransferLevel2Type) {
        GameStore.commit("setEnemyState", GameState.PLAYING);
        GameStore.commit("setMyState", GameState.PLAYING);
        GameStore.commit("setMyTurnToShoot", data.turn_to_shoot);

        if (data.turn_to_shoot) await GameStore.dispatch("enableShooting");
    }
    private static async processFireRequest(data: TransferLevel2Type) {

        let shot: Location = new Location(
            data.shot_location._x,
            data.shot_location._y
        );

        let ht: HighlightType = HighlightType.CIRCLE;

        let ctx = GameStore.getters.getContext2D;

        let fireResponse: FireResponseType = {
            msg_type: MessageType.FIRE_RESPONSE,
            shot_result: ShotResult.MISS,
            enemy_client_id: GameProcessManager.enemyClientUuid,
        };

        let ship: Ship | undefined = Game.getShipByLocation(shot);

        // если наш корабль ранили
        if (ship) {
            ht = HighlightType.CROSS; // меняем тип выделения на "крест"
            ship.hitsNumber++; // увеличиваем счетчик ранений у подбитого корабля

            // находим диагональные локации
            let diags: Location[] = Game.getDiagonalLocations(shot);
            // подсвечиваем диагональные локации
            await Game.highlightDiagonals(ctx, diags);

            // если корабль только ранен
            if (ship.hitsNumber < ship.length) {
                fireResponse.shot_result = ShotResult.HIT;
            } else {
                // если корабль потоплен
                fireResponse.shot_result = ShotResult.SUNK;

                // формируем подбитый корабль
                let ss: ShipType = {
                    length: ship.length,
                    loc: { _x: ship.location.x, _y: ship.location.y },
                    type: ship.type,
                };

                fireResponse.sunkShip = ss;
                // находим боковые локации
                let edgeLocs = await Ship.getFrontAndBackLocations(
                    ss.length,
                    ss.loc._x,
                    ss.loc._y,
                    ss.type
                );

                // выделяем их на своем гриде
                for (const loc of edgeLocs) await loc.highlight(ctx);

                // Если все корабли потоплены, даем знать об этом противнику. Игра окончена!
                if (Game.allShipsAreSunk()) {
                    GameStore.commit("setMyState", GameState.GAME_IS_OVER);
                    GameStore.commit("setEnemyState", GameState.GAME_IS_OVER);
                    // Отправляем сопернику информацию о завершение игры с типом сообщения GAME_OVER
                    const ws: WebSocket = WebSocketManager.getWebSocket();
                    ws.send(
                        JSON.stringify({
                            msg_type: MessageType.GAME_OVER,
                            enemy_client_id: GameProcessManager.enemyClientUuid,
                        })
                    );
                }
            }
            await GameStore.dispatch("disableShooting");
        } else await GameStore.dispatch("enableShooting");

        await shot.highlight(ctx, ht);

        // Отправляем сопернику информацию о попадании (мимо/ранил/потоплен)
        // с типом сообщения FIRE_RESPONSE
        const ws: WebSocket = WebSocketManager.getWebSocket();
        ws.send(JSON.stringify(fireResponse));

        GameStore.commit("setEnemyShotHint", shot.toString());
    }
    private static async processFireResponse(data: TransferLevel2Type) {
        let hostileCtx = GameStore.getters.getHostileContext2D;

        let shot: Location = GameProcessManager.currentShot;
        Game.addToShotHistory(shot);

        if (data.shot_result === ShotResult.MISS) {
            // Если промахнулись
            await shot.highlight(hostileCtx);
            GameStore.commit("setEnemyShotHint", "");
            await GameStore.dispatch("disableShooting");
        } else {
            // если попали (ранили), то
            // подсвечиваем локацию на вражеском гриде
            await shot.highlight(hostileCtx, HighlightType.CROSS);
            // находим диагональные локации
            let diags: Location[] = Game.getDiagonalLocations(shot);
            // подсвечиваем диагональные локации
            await Game.highlightDiagonals(hostileCtx, diags);
            // добавляем диагональные локации в историю выстрелов
            for (const loc of diags) Game.addToShotHistory(loc);

            // если от соперника пришла информация, что корабль потоплен
            if (data.shot_result === ShotResult.SUNK) {
                let sunkShip = data.sunkShip;
                if (sunkShip) {
                    // находим боковые локации
                    let edgeLocs = await Ship.getFrontAndBackLocations(
                        sunkShip.length,
                        sunkShip.loc._x,
                        sunkShip.loc._y,
                        sunkShip.type
                    );

                    // выделяем их на гриде соперника
                    for (const loc of edgeLocs) await loc.highlight(hostileCtx);
                    // и добавляем в историю выстрелов
                    for (const loc of edgeLocs) Game.addToShotHistory(loc);
                }
            }
        }
    }
    private static async processGameOver(data: TransferLevel2Type) {
        GameStore.commit("setMyState", GameState.GAME_IS_OVER);
        GameStore.commit("setEnemyState", GameState.GAME_IS_OVER);
        GameStore.commit("setIsWinner", true);

        await GameStore.dispatch("disableShooting");
        // Отправим сопернику информацию о непотопленных кораблях
        await this.sendUnsunkShipsToEnemy();
    }
    private static async processUnsunkShips(data: TransferLevel2Type) {
        let unsunkShips: Ship[] = data.unSunkShips.map(
            (s) =>
                new Ship(s.length, s.type, new Location(s.loc._x, s.loc._y))
        );

        // Покажем где у соперника остались непотопленные корабли
        let hostileCtx = GameStore.getters.getHostileContext2D;
        unsunkShips.forEach((ship) => ship.draw(hostileCtx, "red"));
    }
    private static async processDisconnection(data: TransferLevel2Type) {
        UIHandler.showAlert(
            "К сожалению, ваш соперник разорвал соединение и вышел из игры. Обновите страницу для новой игры",
            "danger",
            10000
        );
    }
    private static async processPlayAgain(data: TransferLevel2Type) {
        UIHandler.showAlert(
            "Соперник хочет сыграть с Вами снова",
            "success",
            15000
        );
        GameStore.commit("setEnemyState", GameState.SHIPS_POSITIONING);
    }

    public static handleHostileGridClick(event: MouseEvent) {
        let shotLocation: Location = Location.getLocationByOffsetXY(
            event.offsetX,
            event.offsetY
        );

        if (!shotLocation.isValid()) return;

        if (Game.existsInShotHistory(shotLocation)) {
            UIHandler.showAlert("Вы уже стреляли сюда", "warning");
            return;
        }

        GameProcessManager.currentShot = shotLocation;

        const ws: WebSocket = WebSocketManager.getWebSocket();

        ws.send(
            JSON.stringify({
                msg_type: MessageType.FIRE_REQUEST,
                shot_location: shotLocation,
                enemy_client_id: GameProcessManager.enemyClientUuid,
            })
        );
    }
    private static async sendUnsunkShipsToEnemy() {
        const ws: WebSocket = WebSocketManager.getWebSocket();

        let unsunkShipsResp: UnSunkShipsType = {
            msg_type: MessageType.UNSUNK_SHIPS,
            enemy_client_id: GameProcessManager.enemyClientUuid,
            unSunkShips: [],
        };

        let unSunkShips: Ship[] = Game.getShips().filter(
            (s) => s.hitsNumber < s.length
        );

        for (const ship of unSunkShips) {
            unsunkShipsResp.unSunkShips.push({
                loc: { _x: ship.location.x, _y: ship.location.y },
                length: ship.length,
                type: ship.type,
            });
        }

        ws.send(JSON.stringify(unsunkShipsResp));
    }
}