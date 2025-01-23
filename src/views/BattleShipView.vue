<template>
  <div class="container">
    <input
      class="form-control form-control-lg mb-4"
      placeholder="Введите ник"
      type="text"
      v-model="nickName"
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
          :disabled="!isCaptchaOk"
        >
          Игра со случайным соперником
        </button>
      </div>
      <div class="w-100 maxw-400 pb-3">
        <button
          class="btn btn-lg btn-dark p-3 w-100 text-nowrap"
          type="button"
          @click="handleFriendGameButtonClick"
          :disabled="!isCaptchaOk"
        >
          Игра с другом
        </button>
      </div>
      <div class="w-100 maxw-400 pb-3 ms-lg-5">
        <button
          class="btn btn-lg btn-dark p-3 w-100 text-nowrap"
          type="button"
          @click="handleComputerGameButtonClick"
          :disabled="!isCaptchaOk"
        >
          Игра с компьютером
        </button>
      </div>
    </div>
    <div
      class="border border-dark border-2 rounded-3 mx-auto wfit mb-4"
      v-if="isFriendGameNotCreated()"
    >
      <FriendGameComponent
        :clientUUID="clientUUID"
        @friendUUIDUpdated="validateAndSetFriendUUID"
        :friendInputDisabled="friendInputDisabled"
      />
    </div>
    <div class="mx-auto wfit mb-4" v-if="isFriendGameNotCreated()">
      <button
        class="btn btn-lg btn-dark p-3 text-nowrap minw-17"
        type="button"
        :disabled="!isCaptchaOk"
        @click="handleCreateFriendGameButtonClick"
      >
        Создать игру
      </button>
    </div>
    <div
      class="border border-dark border-2 rounded-3 wfit mx-auto mb-4"
      v-if="!isPlaying"
    >
      <ArrangementRuleComponent />
    </div>
    <StateInfoComponent
      v-if="isStateInfoComponentVisible()"
      :enemyNickName="getEnemyNickname"
      :enemyState="getEnemyState"
      :myState="getMyState"
      :gameType="gameType"
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
          :disabled="!isPlayButtonEnabled()"
        >
          {{ getPlayButtonCaption() }}
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
      gameType: GameType.RANDOM,
      nickName: "",
      isCaptchaOk: true,
      isPlaying: false,
      captchaVisible: false,
      clientUUID: "",
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
    isStateInfoComponentVisible() {
      return (
        this.getMyState !== GameState.NOT_CREATED &&
        this.getMyState !== GameState.GAME_IS_OVER
      );
    },

    isPlayButtonEnabled() {
      return (
        (this.getMyState === GameState.SHIPS_POSITIONING &&
          (this.getEnemyState === GameState.SHIPS_POSITIONING ||
            this.getEnemyState === GameState.SHIPS_ARE_ARRANGED)) ||
        this.getMyState === GameState.GAME_IS_OVER ||
        (this.gameType === GameType.COMPUTER &&
          this.getMyState === GameState.SHIPS_POSITIONING)
      );
    },

    hideAlert() {
      GameStore.commit("hideAlert");
    },

    isFriendGameNotCreated() {
      return (
        this.gameType === GameType.FRIEND &&
        this.getMyState === GameState.NOT_CREATED
      );
    },

    processCaptcha(isCaptchaSuccess: boolean) {
      this.isCaptchaOk = isCaptchaSuccess;
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
        if (parsedUUID === this.clientUUID) {
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
      let length = this.nickName.trim().length;

      if (length === 0) {
        UIHandler.showAlert("Ник не должен быть пустым!", "warning");
        return false;
      }

      let maxLength = 25;

      if (length > maxLength) {
        UIHandler.showAlert(
          `Максимальная длина ника ${maxLength} символов!`,
          "warning"
        );
        return false;
      }

      return true;
    },

    handleGameCreation() {
      if (this.gameType === GameType.RANDOM)
        GameStore.commit("setMyState", GameState.SEARCHING_FOR_OPPONENT);
      else GameStore.commit("setMyState", GameState.WAITING_FOR_FRIEND);

      let ws: WebSocket = WebSocketManager.createWebSocket(this.clientUUID);

      let gameCreationBody = GameProcessManager.getGameCreationBody(
        this.gameType,
        this.nickName.trim(),
        this.friendUUID
      );

      WebSocketManager.setupWSAndCreateGameOnOpen(ws, gameCreationBody);
    },

    handleRandomGameButtonClick() {
      if (!this.isNickNameValid()) return;

      if (this.isPlaying) {
        UIHandler.showAlert(
          "Игра уже создана или в процессе создания. Для новой игры необходимо обновить страницу!",
          "warning",
          7000
        );
        return;
      }
      this.isPlaying = true;
      this.clientUUID = uuidv4();
      this.handleGameCreation();
    },

    handleFriendGameButtonClick() {
      if (!this.isNickNameValid()) return;

      if (this.isPlaying) {
        UIHandler.showAlert(
          "Игра уже создана или в процессе создания. Для новой игры необходимо обновить страницу!",
          "warning",
          7000
        );
        return;
      }
      this.isPlaying = true;
      this.gameType = GameType.FRIEND;
      this.clientUUID = uuidv4();
    },

    handleComputerGameButtonClick() {
      console.log("handleComputerGameButtonClick");

      if (this.isPlaying) {
        UIHandler.showAlert(
          "Игра уже создана или в процессе создания. Для новой игры необходимо обновить страницу!",
          "warning",
          7000
        );
        return;
      }
      this.isPlaying = true;

      GameStore.commit("setMyState", GameState.SHIPS_POSITIONING);

      this.gameType = GameType.COMPUTER;
    },

    handleCreateFriendGameButtonClick() {
      if (!this.friendUUID) {
        UIHandler.showAlert("Некорректный id друга", "warning", 5000);
        return;
      }
      this.handleGameCreation();
    },

    async handlePlayButtonClick(event: Event) {
      if (!this.isPlaying) {
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

      if (!Game.isArrangementCorrect(Game.getShips())[0]) {
        UIHandler.showAlert("Корабли расставлены некорректно!");
        return;
      }

      if (this.getMyState === GameState.GAME_IS_OVER) {
        await this.handlePlayAgain();
        return;
      }

      GameStore.commit("setMyState", GameState.SHIPS_ARE_ARRANGED);

      // Удаляем обработчики событий мыши (Pointer), чтобы игрок не мог менять расстановку кораблей во время игры
      GameStore.dispatch("removeOwnGridEventListeners");

      if (this.gameType === GameType.COMPUTER) {
        await this.setAttributesForComputerGame();
        return;
      }

      const ws: WebSocket = WebSocketManager.getWebSocket();
      ws.send(
        JSON.stringify({
          msg_type: MessageType.SHIPS_ARE_ARRANGED,
          game_id: GameProcessManager.getGameId(),
        })
      );
    },

    async handlePlayAgain() {
      Game.refreshGridAndShips();
      GameStore.commit("setMyState", GameState.SHIPS_POSITIONING);
      GameStore.commit("setIsWinner", false);
      GameStore.commit("setEnemyShotHint", "");
      await GameStore.dispatch("addOwnGridEventListeners");
      const ws: WebSocket = WebSocketManager.getWebSocket();
      ws.send(
        JSON.stringify({
          msg_type: MessageType.PLAY_AGAIN,
          game_id: GameProcessManager.getGameId(),
          enemy_client_id: GameProcessManager.getEnemyUUID(),
        })
      );
    },

    getPlayButtonCaption(): string {
      let caption =
        this.gameType === GameType.RANDOM
          ? "Играть еще раз с тем же соперником"
          : "Играть с другом еще раз";

      return this.getMyState === GameState.GAME_IS_OVER ? caption : "Играть";
    },

    async setAttributesForComputerGame() {
      GameStore.commit("setEnemyNickname", "Computer");
      GameStore.commit("setEnemyState", GameState.PLAYING);
      GameStore.commit("setMyState", GameState.PLAYING);

      let isMyTurn: boolean = Math.random() - 0.5 > 0;
      GameStore.commit("setMyTurnToShoot", isMyTurn);
      if (isMyTurn) await GameStore.dispatch("enableShooting");
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