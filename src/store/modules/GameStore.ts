export const GameStore = {
    state: {
        scaleParameter: 1,
        gridLineThickness: 0.3,
        canvasWidth: 300,
        canvasHeight: 300,
        numberOfCellsOnTheAxisX: 10,
        numberOfCellsOnTheAxisY: 10,
        isOwnGridDisabled: false,
        context2x: CanvasRenderingContext2D
    },
    getters: {
        getCanvasWidth(state: any) {
            return state.canvasWidth * state.scaleParameter;
        },
        getCanvasHeight(state: any) {
            return state.canvasHeight * state.scaleParameter;
        },
        getGridCellWidth(state: any) {
            return state.canvasWidth * state.scaleParameter / state.numberOfCellsOnTheAxisX;
        },
        getGridCellHeight(state: any) {
            return state.canvasHeight * state.scaleParameter / state.numberOfCellsOnTheAxisY;
        },
        getOwnGridDisabled(state: any) {
            return state.isOwnGridDisabled;
        },
        getContext2D(state: any) {
            return state.context2x;
        }
    },
    mutations: {
        disableOwnGrid(state: any) {
            state.isOwnGridDisabled = true;
        },
        setContext2D(state: any, ctx: any) {
            state.context2x = ctx;
        }
    },
    actions: {

    }
}