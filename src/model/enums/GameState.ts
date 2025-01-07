enum GameState {
    NOT_CREATED = 0,
    WAITING_FOR_ENEMY = 1,
    SHIPS_POSITIONING = 2,
    SHIPS_ARE_ARRANGED = 3,
    PLAYING = 4,
    GAME_IS_OVER = 5
}

export default GameState