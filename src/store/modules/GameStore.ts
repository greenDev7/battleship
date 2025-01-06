import GameProcessManager from "@/helpers/GameProcessManager";
import GameState from "@/model/enums/GameState";

export const GameStore = {
    state: {
        scaleParameter: 0.9,
        gridLineThickness: 0.3,
        canvasWidth: 300,
        canvasHeight: 300,
        numberOfCellsOnTheAxisX: 10,
        numberOfCellsOnTheAxisY: 10,
        context2D: CanvasRenderingContext2D,
        hostileContext2D: CanvasRenderingContext2D,
        handlers: {
            pointerDownHandler: Function,
            pointerMoveHandler: Function,
            pointerUpHandler: Function,
            touchStartHandler: Function
        },
        alert: {
            alertVisible: false,
            alertText: "",
            alertColor: "danger",
        },
        myState: GameState.NOT_CREATED,
        enemyState: GameState.NOT_CREATED,
        enemyNickname: "",
        enemyClientUuid: "",
        isMyTurnToShoot: false,
        enemyShotHint: ""
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
            return state.context2D;
        },
        getHostileContext2D(state: any) {
            return state.hostileContext2D;
        },
        getAlert(state: any) {
            return state.alert;
        },
        getMyState(state: any) {
            return state.myState;
        },
        getEnemyNickname(state: any) {
            return state.enemyNickname;
        },
        getEnemyState(state: any) {
            return state.enemyState;
        },
        getEnemyClientUuid(state: any) {
            return state.enemyClientUuid;
        },
        getIsMyTurnToShoot(state: any) {
            return state.isMyTurnToShoot;
        },
        getEnemyShotHint(state: any) {
            return state.enemyShotHint;
        }
    },
    mutations: {
        setContext2D(state: any, ctx: any) {
            state.context2D = ctx;
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
        },
        setMyState(state: any, myState: number) {
            state.myState = myState;
        },
        setEnemyState(state: any, enemyState: number) {
            state.enemyState = enemyState;
        },
        setEnemyNickname(state: any, enemyNickname: string) {
            state.enemyNickname = enemyNickname;
        },
        setEnemyClientUuid(state: any, enemyClientUuid: string) {
            state.enemyClientUuid = enemyClientUuid;
        },
        setMyTurnToShoot(state: any, isMyTurnToShoot: boolean) {
            state.isMyTurnToShoot = isMyTurnToShoot;
        },
        setEnemyShotHint(state: any, enemyShotHint: string) {
            state.enemyShotHint = enemyShotHint;
        }
    },
    actions: {
        async removeOwnGridEventListeners({ state }: any) {
            const canvas = (state.context2D as unknown as CanvasRenderingContext2D).canvas;

            canvas.removeEventListener("pointerdown", state.handlers.pointerDownHandler);
            canvas.removeEventListener("pointermove", state.handlers.pointerMoveHandler);
            canvas.removeEventListener("pointerup", state.handlers.pointerUpHandler);
            canvas.removeEventListener("touchstart", state.handlers.touchStartHandler);
        },
        async enableShooting({ commit, state }: any) {
            const canvas = (state.hostileContext2D as unknown as CanvasRenderingContext2D).canvas;
            canvas.addEventListener("click", GameProcessManager.handleHostileGridClick);
            commit("setMyTurnToShoot", true);
        },
        async disableShooting({ commit, state }: any) {
            const canvas = (state.hostileContext2D as unknown as CanvasRenderingContext2D).canvas;
            canvas.removeEventListener("click", GameProcessManager.handleHostileGridClick);
            commit("setMyTurnToShoot", false);
        }
    }
}