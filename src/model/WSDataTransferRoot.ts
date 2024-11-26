export default interface WSDataTransferRoot {
    msg_type: string;
    data: TransferLevel2;
    is_status_ok: boolean;
};


interface TransferLevel2 {
    enemy_nickname: string;
};