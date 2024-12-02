export default interface WSDataTransferRoot {
    msg_type: string;
    data: TransferLevel2;
    is_status_ok: boolean;
};


interface TransferLevel2 {
    enemy_nickname: string;
    turn_to_shoot: boolean;
    enemy_client_id: string;
    shot_location: Loc;
};


interface Loc {
    _x: number;
    _y: number;
}