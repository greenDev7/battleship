export const CaptionStore = {
    state: {
        rusCaptions: {
            loserHeader: "Поражение!",
            winnerHeader: "Победа!",
            loserText: "Ваш соперник оказался сильнее! Но не отчаивайтесь, попробуйте еще раз!",
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
