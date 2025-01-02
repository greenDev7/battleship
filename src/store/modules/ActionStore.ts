export const ActionStore = {
    state: {
        enemyClientUuid: "",
        ws: WebSocket
    },
    getters: {
        getWebSocket(state: any): WebSocket {
            return state.ws;
        },
        getEnemyClientUuid(state: any) {
            return state.enemyClientUuid;
        }
    },
    mutations: {
        setWebSocket(state: any, ws: WebSocket) {
            state.ws = ws;
        },
        setEnemyClientUuid(state: any, enemyClientUuid: string) {
            state.enemyClientUuid = enemyClientUuid;
        }
    },
    actions: {
        async createRivalCouple(context: any, payload: any) {
            const { ws, gameCreationBody } = payload;
            context.commit("setWebSocket", ws);
            console.log('Sending WS request to create game...');
            ws.send(JSON.stringify(gameCreationBody));
        }
    }
}
