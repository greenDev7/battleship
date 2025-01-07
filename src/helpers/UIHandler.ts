import GameStore from "@/store/index";

export default class UIHandler {

    public static async showAlert(
        alertText: string,
        alertColor: string = "danger",
        delay: number = 3000
    ) {
        GameStore.commit("setAlert", { alertText, alertColor });
        setTimeout(UIHandler.hideAlert, delay);
    }
    private static hideAlert() {
        GameStore.commit("hideAlert");
    }
}