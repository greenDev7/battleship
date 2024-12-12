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
};

interface TransferLevel2 extends FireResponse {
    enemy_nickname: string;
    turn_to_shoot: boolean;
    shot_location: Loc;
};

interface WSDataTransferRoot extends MsgType {
    data: TransferLevel2;
    is_status_ok: boolean;
};

export type { FireResponse as FireResponseType, WSDataTransferRoot as WSDataTransferRootType, Loc as LocType }