enum MessageType {
    GAME_CREATION = 0,
    DISCONNECTION = "disconnection",
    SHIPS_ARE_ARRANGED = "ships_are_arranged",
    PLAY = "play",
    FIRE_REQUEST = "fire_request",
    FIRE_RESPONSE = "fire_response",
    UNSUNK_SHIPS = "unsunk_ships",
    GAME_OVER = "game_over"
}

export default MessageType