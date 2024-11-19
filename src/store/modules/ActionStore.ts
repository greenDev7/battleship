import axiosInstance from '@/helpers/axios';
import axios from 'axios';
import { createStore } from 'vuex';

export default createStore({
    state: {
    },
    getters: {
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
        }
    },
    modules: {
    },
})
