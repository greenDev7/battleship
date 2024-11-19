import axiosInstance from '@/helpers/axios';
// import ws from '@/websocket/ws';
import axios from 'axios';
import { createStore } from 'vuex';

export default createStore({
    state: {
        baseWebSocketUrl: "ws://127.0.0.1:5000/ws",
        ws: new WebSocket("ws://127.0.0.1:5000/ws")
    },
    getters: {
        getWebSocket(state) {
            return state.ws;
        }
    },
    mutations: {
    },
    actions: {
        async sayHello(context) {
            console.log('Hello! I am from Actions =)');
        },
        async createUser(context, userRequestBody) {
            axiosInstance.post("/user/", userRequestBody)
                .catch((reason) => console.log("createUser error:", reason));
        },
        async createUserWS(context, payload) {
            const { ws, userRequestBody } = payload;
            console.log('sending ws request to create user for random game');
            ws.send(JSON.stringify(userRequestBody));
        }
    },
    modules: {
    },
})
