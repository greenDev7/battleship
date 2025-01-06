enum MessageType {
    GAME_CREATION = 0,
    DISCONNECTION = "disconnection",
    SHIPS_ARE_ARRANGED = 1,
    PLAY = 2,
    FIRE_REQUEST = 3,
    FIRE_RESPONSE = "fire_response",
    UNSUNK_SHIPS = "unsunk_ships",
    GAME_OVER = "game_over"
}

export default MessageType