import { createStore } from 'vuex'
import { ActionStore } from './modules/ActionStore'
import { GameStore } from './modules/GameStore'
import { CaptionStore } from './modules/CaptionStore'

export default createStore({
    state: {},
    getters: {},
    mutations: {},
    actions: {},
    modules: {
        ActionStore, GameStore, CaptionStore
    }
})
