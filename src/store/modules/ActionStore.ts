import axiosInstance from '@/helpers/axios';

export const ActionStore = {
    state: {
        enemyStatusCaption: 'Поиск соперника...'
    },
    getters: {
        getEnemyStatusCaption(state: any) {
            return state.enemyStatusCaption;
        }
    },
    mutations: {
    },
    actions: {
        async sayHello(context: any) {
            console.log('Hello! I am from Actions =)');
        },
        async createUser(context: any, userRequestBody: any) {
            axiosInstance.post("/user/", userRequestBody)
                .catch((reason) => console.log("createUser error:", reason));
        },
        async createTeamPlayerWS(context: any, payload: any) {
            const { ws, userRequestBody } = payload;
            console.log('Sending WS request to find a suitable player...');
            ws.send(JSON.stringify(userRequestBody));
        },

        async nickNameExists(context: any, nickName_: string) {

            console.log('Checking nickname in DB...');

            return axiosInstance.get('user/exists', { params: { nick_name: nickName_ } });
        }
    }
}
