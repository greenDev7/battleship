import { WSDataTransferRootType } from "@/model/WSDataTransferRoot";

export default class WebSocketManager {

    private static ws: WebSocket;
    private static readonly WS_SERVER_HOST: string = "192.168.0.12";
    private static readonly WS_SERVER_PORT: number = 5000;
    private static isConnected: boolean = false;

    public static createWebSocket(clientUUID: string, onMessageFunction: Function) {
        let host = WebSocketManager.WS_SERVER_HOST;
        let port = WebSocketManager.WS_SERVER_PORT;

        WebSocketManager.ws = new WebSocket(`ws://${host}:${port}/client/${clientUUID}/ws`);

        WebSocketManager.ws.onopen = function (event) {
            WebSocketManager.isConnected = true;
            console.log("Successfully connected to the websocket server");
        };

        WebSocketManager.ws.onmessage = async function (event: MessageEvent<string>) {
            await onMessageFunction(event.data);
        };

        WebSocketManager.ws.onerror = function (event: Event) {
            console.log("Connection error");
        };

        WebSocketManager.ws.onclose = function (event: CloseEvent) {
            if (event.wasClean) {
                console.log("Connection closed correctly");
            } else {
                console.error("The connection was broken");
            }
        };
    }
    public static async sendStructuredDataToServer(data: WSDataTransferRootType) {
        WebSocketManager.ws.send(JSON.stringify(data));
    }
    public static getWebSocket(): WebSocket {
        return WebSocketManager.ws;
    }
    public static isWSConnected(): boolean {
        return WebSocketManager.isConnected;
    }
}