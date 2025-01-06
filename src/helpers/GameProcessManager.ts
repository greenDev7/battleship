import GameState from "@/model/enums/GameState";
import GameType from "@/model/enums/GameType";
import MessageType from "@/model/enums/MessageType";
import Game from "@/model/Game";
import Location from "@/model/Location";
import { FireResponseType, GameCreationBodyType, TransferLevel2Type, WSDataTransferRootType } from "@/model/WSDataTransferRoot";
import GameStore from "@/store/index";
import WebSocketManager from "./WebSocketManager";
import HighlightType from "@/model/enums/HighlightType";
import ShotResult from "@/model/enums/ShotResult";
import Ship from "@/model/Ship";

export default class GameProcessManager {

    private static currentShot: Location;
    private static enemyClientUuid: string;

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

    private static processGameCreation(data: TransferLevel2Type) {
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

        if (ship) {
            ht = HighlightType.CROSS; // меняем тип выделения на "крест"
            ship.hitsNumber++; // увеличиваем счетчик ранений у подбитого корабля

            // находим диагональные локации
            let diags: Location[] = Game.getDiagonalLocations(shot);
            // подсвечиваем диагональные локации
            await Game.highlightDiagonals(ctx, diags);
        }

    }

    public static handleHostileGridClick(event: MouseEvent) {
        let shotLocation: Location = Location.getLocationByOffsetXY(
            event.offsetX,
            event.offsetY
        );

        if (!shotLocation.isValid()) return;

        if (Game.existsInShotHistory(shotLocation)) {
            GameProcessManager.showAlert("Вы уже стреляли сюда", "warning");
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

    private static showAlert(
        alertText: string,
        alertColor: string = "danger",
        delay: number = 3000
    ) {
        GameStore.commit("setAlert", { alertText, alertColor });
        setTimeout(GameProcessManager.hideAlert, delay);
    }

    private static hideAlert() {
        GameStore.commit("hideAlert");
    }
}