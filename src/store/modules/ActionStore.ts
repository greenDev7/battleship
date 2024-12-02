import axiosInstance from '@/helpers/axios';

export const ActionStore = {
    state: {
        clientUuid: "",
        enemyClientUuid: "",
        ws: WebSocket
    },
    getters: {
        getWebSocket(state: any): WebSocket {
            return state.ws;
        },
        getClientUuid(state: any): string {
            return state.clientUuid;
        },
        getEnemyClientUuid(state: any) {
            return state.enemyClientUuid;
        }
    },
    mutations: {
        setWebSocket(state: any, ws: WebSocket) {
            state.ws = ws;
        },
        setClientUuid(state: any, clientUuid: string) {
            state.clientUuid = clientUuid;
        },
        setEnemyClientUuid(state: any, enemyClientUuid: string) {
            state.enemyClientUuid = enemyClientUuid;
        }
    },
    actions: {
        async createUser(context: any, userRequestBody: any) {
            axiosInstance.post("/user/", userRequestBody)
                .catch((reason) => console.log("createUser error:", reason));
        },
        async createTeamPlayerWS(context: any, payload: any) {
            const { ws, userRequestBody, clientUuid } = payload;
            context.commit("setWebSocket", ws);
            context.commit("setClientUuid", clientUuid);
            console.log('Sending WS request to find a suitable player...');
            ws.send(JSON.stringify(userRequestBody));
        },

        async nickNameExists(context: any, nickName_: string) {

            console.log('Checking nickname in DB...');

            return axiosInstance.get('user/exists', { params: { nick_name: nickName_ } });
        }
    }
}
