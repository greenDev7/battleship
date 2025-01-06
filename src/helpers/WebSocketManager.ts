import { GameCreationBodyType } from "@/model/WSDataTransferRoot";
import GameProcessManager from "./GameProcessManager";

export default class WebSocketManager {

    private static ws: WebSocket;
    private static readonly WS_SERVER_HOST: string = "192.168.0.12";
    private static readonly WS_SERVER_PORT: number = 5000;

    public static createWebSocket(clientUUID: string): WebSocket {

        let host = WebSocketManager.WS_SERVER_HOST;
        let port = WebSocketManager.WS_SERVER_PORT;

        let socket: WebSocket = new WebSocket(`ws://${host}:${port}/client/${clientUUID}/ws`);

        return socket;
    }

    public static setupWSAndCreateGameOnOpen(ws: WebSocket, gameCreationBody: GameCreationBodyType) {

        ws.onopen = function (event) {
            console.log("Opening a connection...");
            WebSocketManager.ws = ws;
            ws.send(JSON.stringify(gameCreationBody));
            console.log("Successfully connected to the websocket server");
        };

        ws.onmessage = async function (event: MessageEvent<string>) {
            await GameProcessManager.processData(event.data);
        };

        ws.onerror = function (event: Event) {
            console.log("Connection error");
        };
        
        ws.onclose = function (event: CloseEvent) {
            if (event.wasClean) {
                console.log("Connection closed correctly");
            } else {
                console.error("The connection was broken");
            }
        };
    }

    public static async sendDataToServer(ws: WebSocket, data: any) {
        if (ws) ws.send(JSON.stringify(data));
    }
    public static getWebSocket(): WebSocket {
        return WebSocketManager.ws;
    }
}