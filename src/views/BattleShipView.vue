<template>
  <div class="container">
    <input
      class="form-control form-control-lg mb-4"
      placeholder="Введите ник"
      type="text"
      v-model="nickName"
      :disabled="nicknameDisabled"
    />
    <div
      v-if="this.captchaVisible"
      class="border border-secondary border-3 rounded-3 p-1 wfit mx-auto mb-4"
    >
      <CaptchaComponent @captchaOkButtonClicked="processCaptcha" />
    </div>
    <div class="d-flex flex-row flex-wrap mb-3 justify-content-center">
      <div class="w-100 maxw-400 pb-3 me-lg-5">
        <button
          class="btn btn-lg btn-dark p-3 w-100 text-nowrap"
          type="button"
          @click="handleRandomGameButtonClick"
          :disabled="topButtonDisabled"
        >
          Игра со случайным соперником
        </button>
      </div>
      <div class="w-100 maxw-400 pb-3 ms-lg-5">
        <button
          class="btn btn-lg btn-dark p-3 w-100 text-nowrap"
          type="button"
          :disabled="topButtonDisabled"
          @click="handleFriendGameButtonClick"
        >
          Игра с другом
        </button>
      </div>
      <!-- <div class="w-100 maxw-400 pb-3">
        <button
          class="btn btn-lg btn-dark p-3 w-100 text-nowrap"
          type="button"
          :disabled="topButtonDisabled"
        >
          Игра с компьютером
        </button>
      </div> -->
    </div>
    <div
      class="border border-dark border-2 rounded-3 mx-auto wfit mb-4"
      v-if="friendComponentVisible"
    >
      <FriendGameComponent
        :clientUUID="myUUIDforFriendGame"
        @friendUUIDUpdated="validateAndSetFriendUUID"
        :friendInputDisabled="friendInputDisabled"
      />
    </div>
    <div
      class="border border-dark border-2 rounded-3 wfit mx-auto mb-4"
      v-if="getMyState === 0"
    >
      <ArrangementRuleComponent />
    </div>
    <StateInfoComponent
      v-if="getMyState !== 0 && getMyState !== 5"
      :enemyNickName="getEnemyNickname"
      :enemyState="getEnemyState"
      :myState="getMyState"
    />
    <GameOverInfoComponent v-if="getMyState === 5" :isWinner="getIsWinner" />

    <BattleBoardComponent
      :isMyTurnToShoot="getIsMyTurnToShoot"
      :turnOrderHintsVisible="getMyState === 4"
      :enemyShotHint="getEnemyShotHint"
      :enemyNickname="getEnemyNickname"
    />
    <div
      class="d-flex flex-row flex-wrap mt-4 mb-4 mt-lg-3 justify-content-center"
    >
      <div class="minw-17">
        <button
          ref="playButton"
          class="btn btn-lg btn-success w-100 text-nowrap"
          type="button"
          @click="handlePlayButtonClick"
          :disabled="!(getMyState === 2 || getMyState === 5)"
        >
          Играть
        </button>
      </div>
    </div>
    <div class="position-fixed alpos">
      <div
        class="alert alert-dismissible fade show"
        :class="`alert-${getAlert.alertColor}`"
        role="alert"
        v-show="getAlert.alertVisible"
      >
        {{ getAlert.alertText }}
        <button
          type="button"
          class="btn-close"
          aria-label="Close"
          @click="hideAlert"
        ></button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import BattleBoardComponent from "../components/BattleBoardComponent.vue";
import GameOverInfoComponent from "../components/GameOverInfoComponent.vue";
import CaptchaComponent from "../components/CaptchaComponent.vue";
import ArrangementRuleComponent from "../components/ArrangementRuleComponent.vue";
import FriendGameComponent from "../components/FriendGameComponent.vue";
import { defineComponent } from "vue";
import MessageType from "@/model/enums/MessageType";
import StateInfoComponent from "@/components/StateInfoComponent.vue";
import {
  v4 as uuidv4,
  parse as uuidParse,
  stringify as uuidStringify,
  MAX as MAX_UUID,
  NIL as NIL_UUID,
} from "uuid";
import { mapGetters } from "vuex";
import GameStore from "@/store/index";
import Game from "@/model/Game";
import WebSocketManager from "@/helpers/WebSocketManager";
import GameProcessManager from "@/helpers/GameProcessManager";
import GameType from "@/model/enums/GameType";
import GameState from "@/model/enums/GameState";
import UIHandler from "@/helpers/UIHandler";

export default defineComponent({
  name: "BattleShipView",

  components: {
    BattleBoardComponent,
    StateInfoComponent,
    GameOverInfoComponent,
    CaptchaComponent,
    ArrangementRuleComponent,
    FriendGameComponent,
  },

  data() {
    return {
      gameType: 1,
      nickName: "",
      topButtonDisabled: false,
      nicknameDisabled: false,
      playButtonDisabled: false,
      isPlaying: false,
      captchaVisible: false,
      friendComponentVisible: false,
      myUUIDforFriendGame: "",
      friendUUID: "",
      friendInputDisabled: false,
    };
  },

  computed: {
    ...mapGetters([
      "getMyState",
      "getEnemyState",
      "getEnemyNickname",
      "getEnemyShotHint",
      "getIsMyTurnToShoot",
      "getIsWinner",
      "getAlert",
    ]),
  },

  methods: {
    processCaptcha(isCaptchaSuccess: boolean) {
      this.topButtonDisabled = !isCaptchaSuccess;
      this.captchaVisible = !isCaptchaSuccess;

      if (!isCaptchaSuccess) UIHandler.showAlert("Неверный код", "danger");
    },

    validateAndSetFriendUUID(eventArg: string) {
      try {
        let parsedUUID = uuidStringify(uuidParse(eventArg));
        if (parsedUUID === MAX_UUID || parsedUUID === NIL_UUID) {
          UIHandler.showAlert(
            "Некорректный UUID (NIL/MAX UUID)",
            "danger",
            3000
          );
          return;
        }
        if (parsedUUID === this.myUUIDforFriendGame) {
          UIHandler.showAlert(
            "UUID ваш и друга не могут совпадать",
            "danger",
            5000
          );
          return;
        }
        this.friendUUID = parsedUUID;
        UIHandler.showAlert("UUID валидный", "success", 5000);
      } catch (error) {
        UIHandler.showAlert("Невалидный UUID", "danger", 7000);
      }
    },

    preventNavAndUnload(event: BeforeUnloadEvent) {
      if (!this.isPlaying) return;
      event.preventDefault();
      event.returnValue = "";
    },

    isNickNameValid(): boolean {
      return this.nickName.trim().length !== 0;
    },

    handleRandomGameButtonClick() {
      if (!this.isNickNameValid()) {
        UIHandler.showAlert("Для игры необходимо ввести ник!", "warning");
        return;
      }

      if (WebSocketManager.getWebSocket()) {
        UIHandler.showAlert(
          "Соединение уже установлено. Для новой игры необходимо обновить страницу!",
          "warning",
          5000
        );
        return;
      }

      this.gameType = GameType.RANDOM;
      GameStore.commit("setMyState", GameState.WAITING_FOR_ENEMY);

      const clientUUID = uuidv4();

      let ws: WebSocket = WebSocketManager.createWebSocket(clientUUID);

      let gameCreationBody = GameProcessManager.getGameCreationBody(
        GameType.RANDOM,
        this.nickName.trim(),
        ""
      );

      WebSocketManager.setupWSAndCreateGameOnOpen(ws, gameCreationBody);

      this.isPlaying = true; // устанавливаем факт начала игры
    },

    handleFriendGameButtonClick() {
      if (!this.isNickNameValid()) {
        UIHandler.showAlert("Для игры необходимо ввести ник!", "warning");
        return;
      }

      this.gameType = GameType.FRIEND;

      // формируем свой UUID для игры с другом
      this.myUUIDforFriendGame = uuidv4();
      console.log(
        "Your clientUUID for friend game: ",
        this.myUUIDforFriendGame
      );

      this.isPlaying = true; // устанавливаем факт начала игры

      this.friendComponentVisible = true;
      this.topButtonDisabled = true;
      this.nicknameDisabled = true;
    },

    async processPlayButton() {
      if (this.gameType === GameType.FRIEND)
        (this.$refs.playButton as HTMLButtonElement).innerHTML =
          "Играть еще раз";
      this.playButtonDisabled = false;
    },

    processRandomGameCreation() {
      const ws: WebSocket = WebSocketManager.getWebSocket();

      ws.send(
        JSON.stringify({
          msg_type: MessageType.SHIPS_ARE_ARRANGED,
          game_type: this.gameType,
        })
      );
    },

    processFriendGameCreation() {
      const ws: WebSocket = WebSocketManager.getWebSocket();

      ws.send(
        JSON.stringify({
          msg_type: MessageType.SHIPS_ARE_ARRANGED,
          game_type: this.gameType,
        })
      );
    },

    handlePlayButtonClick(event: Event) {
      if (!WebSocketManager.getWebSocket()) {
        UIHandler.showAlert(
          "Игра еще не создана. Выберите тип игры с помощью кнопок выше",
          "warning",
          5000
        );
        return;
      }

      if (Game.getShips().length === 0) {
        UIHandler.showAlert(
          "Корабли отсутствуют, необходимо почистить куки и обновить страницу!"
        );
        return;
      }

      Game.clearShotHistory();

      if (!Game.isArrangementCorrect()[0]) {
        UIHandler.showAlert("Корабли расставлены некорректно!");
        return;
      }

      GameStore.commit("setMyState", GameState.SHIPS_ARE_ARRANGED);

      if (this.gameType === GameType.RANDOM) this.processRandomGameCreation();
      else this.processFriendGameCreation();

      // Удаляем обработчики событий мыши (Pointer), чтобы игрок не мог менять расстановку кораблей во время игры
      GameStore.dispatch("removeOwnGridEventListeners");
    },
  },

  beforeRouteLeave(to: any, from: any, next: any) {
    if (this.isPlaying) {
      if (
        !window.confirm(
          "Игра будет завершена при переходе на другую вкладку. Перейти на другую вкладку ?"
        )
      ) {
        return;
      } else WebSocketManager.getWebSocket().close();
    }
    next();
  },

  beforeMount() {
    window.addEventListener("beforeunload", this.preventNavAndUnload);
  },

  beforeUnmount() {
    window.removeEventListener("beforeunload", this.preventNavAndUnload);
  },
});
</script>

<style lang="css" scoped>
.alpos {
  bottom: 1rem;
  left: 1rem;
}

.maxw-400 {
  max-width: 25rem;
}

.minw-17 {
  min-width: 17rem;
}
</style>