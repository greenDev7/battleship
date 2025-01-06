export const ActionStore = {
    state: {
        enemyClientUuid: "",
        ws: WebSocket
    },
    getters: {
        getWebSocket(state: any): WebSocket {
            return state.ws;
        },
    },
    mutations: {
        setWebSocket(state: any, ws: WebSocket) {
            state.ws = ws;
        },
    },
    actions: {
        async saveSocketAndCreateRivalCouple(context: any, payload: any) {
            const { ws, gameCreationBody } = payload;
            context.commit("setWebSocket", ws);
            console.log('Sending WS request to create game...');
            ws.send(JSON.stringify(gameCreationBody));
        }
    }
}
