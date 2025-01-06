import GameState from "@/model/enums/GameState";
import GameType from "@/model/enums/GameType";
import MessageType from "@/model/enums/MessageType";
import { GameCreationBodyType, TransferLevel2Type, WSDataTransferRootType } from "@/model/WSDataTransferRoot";
import GameStore from "@/store/index";

export default class GameProcessManager {

    private static enemyUUID: string = '';
    private static enemyNickName: string = '';

    public static async processData(dataFromServer: string) {
        console.log('Data from server was received: ', dataFromServer);

        let parsedData: WSDataTransferRootType = JSON.parse(dataFromServer);

        switch (parsedData.msg_type) {
            case MessageType.GAME_CREATION:
                if (parsedData.is_status_ok)
                    GameProcessManager.processGameCreation(parsedData.data);
                break;

            default:
                break;
        }
    }

    public static getGameCreationBody(gameType: GameType, nickName: string, enemyUUID: string): GameCreationBodyType {

        GameProcessManager.enemyUUID = enemyUUID;

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
        console.log('GAME_CREATION process starts. Data: ', data);
        GameProcessManager.enemyNickName = data.enemy_nickname;
        GameStore.commit("setEnemyState", GameState.SHIPS_POSITIONING);
        GameStore.commit("setEnemyNickname", data.enemy_nickname);
    }
}