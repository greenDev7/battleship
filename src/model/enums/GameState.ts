enum GameState {
    NOT_CREATED = 0,
    SEARCHING_FOR_OPPONENT = 1,
    SHIPS_POSITIONING = 2,
    SHIPS_ARE_ARRANGED = 3,
    PLAYING = 4,
    GAME_IS_OVER = 5,
    WAITING_FOR_FRIEND = 6
}

export default GameState