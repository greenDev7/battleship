import axiosInstance from '@/helpers/axios';

export const ActionStore = {
    state: {
        enemyStatusCaption: 'Поиск соперника'
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
        async createUserWS(context: any, payload: any) {
            const { ws, userRequestBody } = payload;
            console.log('sending ws request to create user for random game');
            ws.send(JSON.stringify(userRequestBody));
        }
    }
}
