import Game from '@/model/Game';
import Location from "@/model/Location";
import Ship from '@/model/Ship';
import { createStore } from 'vuex';

export default createStore({
    state: {
        scaleParameter: 1.3,
        gridLineThickness: 0.3,
        canvasWidth: 300,
        canvasHeight: 300,
        numberOfCellsOnTheAxisX: 10,
        numberOfCellsOnTheAxisY: 10,
    },
    getters: {
        getCanvasWidth(state) {
            return state.canvasWidth * state.scaleParameter;
        },
        getCanvasHeight(state) {
            return state.canvasHeight * state.scaleParameter;
        },
        getGridCellWidth(state) {
            return state.canvasWidth * state.scaleParameter / state.numberOfCellsOnTheAxisX;
        },
        getGridCellHeight(state) {
            return state.canvasHeight * state.scaleParameter / state.numberOfCellsOnTheAxisY;
        }
    },
    mutations: {
    },
    actions: {

    },
    modules: {
    },
})
