export const CaptionStore = {
    state: {
        rusCaptions: {
            loseHeader: "Поражение!",
            winnerHeader: "Победа!",
            loseText: "Ваш соперник оказался сильнее! Но не отчаивайтесь, попробуйте еще раз!",
            winnerText: "Поздравляю, противник повержен. Вы выиграли этот бой!"
        }
    },
    getters: {
        getCaptions(state: any) {
            return state.rusCaptions;
        }
    },
    mutations: {

    },
    actions: {

    }
}
