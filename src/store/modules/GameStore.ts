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
        handlers: {
            pointerDownHandler: Function,
            pointerMoveHandler: Function,
            pointerUpHandler: Function,
            touchStartHandler: Function,
        },
        alert: {
            alertVisible: false,
            alertText: "",
            alertColor: "danger",
        }
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
        },
        getAlert(state: any) {
            return state.alert;
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
            const { pointerDownHandler, pointerMoveHandler, pointerUpHandler, touchStartHandler } = payload;
            state.handlers.pointerDownHandler = pointerDownHandler;
            state.handlers.pointerMoveHandler = pointerMoveHandler;
            state.handlers.pointerUpHandler = pointerUpHandler;
            state.handlers.touchStartHandler = touchStartHandler;
        },
        setAlert(state: any, { alertText, alertColor }: any) {
            state.alert.alertVisible = true;
            state.alert.alertColor = alertColor;
            state.alert.alertText = alertText;
        },
        hideAlert(state: any) {
            state.alert.alertVisible = false;
        }
    },
    actions: {
        async removeOwnGridEventListeners({ state }: any) {
            const canvas = (state.context2x as unknown as CanvasRenderingContext2D).canvas;

            canvas.addEventListener("pointerdown", state.handlers.pointerDownHandler);
            canvas.addEventListener("pointermove", state.handlers.pointerMoveHandler);
            canvas.addEventListener("pointerup", state.handlers.pointerUpHandler);
            canvas.addEventListener("touchstart", state.handlers.touchStartHandler);
        }
    }
}