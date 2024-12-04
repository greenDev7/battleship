export const GameStore = {
    state: {
        scaleParameter: 1,
        gridLineThickness: 0.3,
        canvasWidth: 300,
        canvasHeight: 300,
        numberOfCellsOnTheAxisX: 10,
        numberOfCellsOnTheAxisY: 10,
        context2x: CanvasRenderingContext2D,
        hostileContext2D: CanvasRenderingContext2D,
        mouseDownHandler: Function,
        mouseUpHandler: Function,
        doubleClickHandler: Function,
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
        getContext2D(state: any) {
            return state.context2x;
        },
        getHostileContext2D(state: any) {
            return state.hostileContext2D;
        }
    },
    mutations: {
        setContext2D(state: any, ctx: any) {
            state.context2x = ctx;
        },
        setContextHostile2D(state: any, ctx: any) {
            state.hostileContext2D = ctx;
        },
        setHandlers(state: any, payload: any) {
            const { mouseDownHandler, mouseUpHandler, doubleClickHandler } = payload;
            state.mouseDownHandler = mouseDownHandler;
            state.mouseUpHandler = mouseUpHandler;
            state.doubleClickHandler = doubleClickHandler;
        }
    },
    actions: {
        async removeOwnGridEventListeners({ state }: any) {
            const canvas = (state.context2x as unknown as CanvasRenderingContext2D).canvas;

            canvas.removeEventListener("mousedown", state.mouseDownHandler);
            canvas.removeEventListener("mouseup", state.mouseUpHandler);
            canvas.removeEventListener("dblclick", state.doubleClickHandler);
        }
    }
}