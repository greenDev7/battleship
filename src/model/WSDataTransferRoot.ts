import ShipOrientation from "./enums/ShipOrientation";

interface MsgType {
    msg_type: string;
};

interface Loc {
    _x: number;
    _y: number;
};

interface FireResponse extends MsgType {
    shot_result: number;
    enemy_client_id: string;
    edgeLocs: Array<Loc>;
    gameIsOver: boolean
};

interface Ship_ {
    loc: Loc;
    type: number;
    length: number;
}

interface UnSunkShips extends MsgType {
    enemy_client_id: string;
    unSunkShips: Ship_[];
}

interface TransferLevel2 extends FireResponse, UnSunkShips {
    enemy_nickname: string;
    turn_to_shoot: boolean;
    shot_location: Loc;
};

interface WSDataTransferRoot extends MsgType {
    data: TransferLevel2;
    is_status_ok: boolean;
};

export type { FireResponse as FireResponseType, WSDataTransferRoot as WSDataTransferRootType, Loc as LocType, UnSunkShips as UnSunkShipsType }