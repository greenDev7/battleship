import Game from '@/model/Game'
import Ship from '@/model/Ship';
import ShipType from '@/model/ShipType';
import { createStore } from 'vuex'

export default createStore({
    state: {
        game: new Game(),
        scaleParameter: 0.8,
        gridLineThickness: 0.3,
        canvasWidth: 300,
        canvasHeight: 300,
        numberOfCellsOnTheAxisX: 10,
        numberOfCellsOnTheAxisY: 10,
        
        ships: [new Ship(2, ShipType.Horizontal)]
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
        },
    },
    mutations: {
    },
    actions: {
    },
    modules: {
    },
})
