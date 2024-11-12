import Game from '@/model/Game';
import Location from "@/model/Location";
import { createStore } from 'vuex';

export default createStore({
    state: {
        gameScale: 1,
        scaleParameter: 1,
        canvasWidth: 508.2,
        canvasHeight: 508.2,
        gameInitialWidth: 1100,
        gameInitialHeight: 528,
        gridLineThickness: 0.3,
        numberOfCellsOnTheAxisX: 10,
        numberOfCellsOnTheAxisY: 10,

        ships: Game.createInitialShips(),
    },
    getters: {
        getGameWidth(state) {
            return state.gameInitialWidth * state.gameScale;
        },
        getGameHeight(state) {
            return state.gameInitialHeight * state.gameScale;
        },
        getCanvasWidth(state) {
            return state.canvasWidth * state.gameScale;
        },
        getCanvasHeight(state) {
            return state.canvasHeight * state.gameScale;
        },
        getGridCellWidth(state) {
            return state.canvasWidth * state.gameScale / state.numberOfCellsOnTheAxisX;
        },
        getGridCellHeight(state) {
            return state.canvasHeight * state.gameScale / state.numberOfCellsOnTheAxisY;
        },
        getShipByLocation: (state) => (location: Location) => {
            return state.ships.find(s => (s.location.x === location.x && s.location.y === location.y));
        },
    },
    mutations: {
        updateScaleParameter(state, scaleParameter: number) {
            state.scaleParameter = scaleParameter;
        },
        updateGameScaleParameter(state, gameScale: number) {
            state.gameScale = gameScale;
        }
    },
    actions: {

    },
    modules: {
    },
})
