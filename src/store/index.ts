import { createStore } from 'vuex'
import { GameStore } from './modules/GameStore'
import { CaptionStore } from './modules/CaptionStore'

export default createStore({
    state: {},
    getters: {},
    mutations: {},
    actions: {},
    modules: {
        GameStore, CaptionStore
    }
})
