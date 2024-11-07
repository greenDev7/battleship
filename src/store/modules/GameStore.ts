import Game from '@/model/Game';
import Location from "@/model/Location";
import Ship from '@/model/Ship';
import { createStore } from 'vuex';

export default createStore({
    state: {
        scaleParameter: 1,
        gridLineThickness: 0.3,
        canvasWidth: 300,
        canvasHeight: 300,
        numberOfCellsOnTheAxisX: 10,
        numberOfCellsOnTheAxisY: 10,

        ships: Game.createInitialShips(),
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
        getShipByLocation: (state) => (location: Location) => {
            return state.ships.find(s => (s.location.x === location.x && s.location.y === location.y));
        },
    },
    mutations: {
        updateScaleParameter(state, scaleParameter: number) {
            state.scaleParameter = scaleParameter;
        }
    },
    actions: {
        
    },
    modules: {
    },
})
