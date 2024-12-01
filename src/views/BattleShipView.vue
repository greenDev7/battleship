<template>
  <div class="fit auto">
    <table class="auto">
      <tbody>
        <tr>
          <td colspan="3">
            <input
              type="text"
              name="fname"
              v-model="nickName"
              :disabled="topButtonDisabled"
            />
          </td>
        </tr>
        <tr>
          <td>
            <button
              class="top-btn"
              @click="clickRandomGameButtonHandle"
              :disabled="topButtonDisabled"
            >
              Игра со случайным соперником
            </button>
          </td>
          <td>
            <button class="top-btn" type="submit" :disabled="topButtonDisabled">
              Игра с другом
            </button>
          </td>
          <td>
            <button class="top-btn" type="submit" :disabled="topButtonDisabled">
              Игра с компьютером
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <EnemyInfoComponent
      id="enemy-component"
      class="fit auto"
      v-if="infoComponentVisible"
      :enemyNickName="this.enemyNickName"
      :enemyState="this.enemyState"
      :isMyTurnToShoot="this.myTurnToShoot"
    />
    <BattleBoardComponent
      class="auto"
      @hostile-grid-click="(loc) => console.log('loc:', loc)"
    />
    <button
      class="btm-btn"
      type="submit"
      @click="handlePlayButtonClick"
      :disabled="playButtonDisabled"
    >
      Играть
    </button>
    <button class="btm-btn" type="submit" :disabled="endGameButtonDisabled">
      Завершить игру
    </button>
    <CAlert
      id="alert"
      dismissible
      :visible="alertVisible"
      @close="
        () => {
          alertVisible = false;
        }
      "
      :color="alertColor"
      >{{ alertText }}
    </CAlert>
  </div>
</template>

<script lang="ts">
import BattleBoardComponent from "../components/BattleBoardComponent.vue";
import { defineComponent } from "vue";
import ActionStore from "@/store/index";
import MessageType from "@/model/MessageType";
import EnemyInfoComponent from "@/components/EnemyInfoComponent.vue";
import { v4 as uuidv4 } from "uuid";
import WSDataTransferRoot from "@/model/WSDataTransferRoot";
import { CAlert } from "@coreui/vue";
import "bootstrap/dist/css/bootstrap.min.css";
import { mapGetters } from "vuex";
import EnemyState from "@/model/EnemyState";
import GameStore from "@/store/index";

export default defineComponent({
  name: "BattleShipView",

  components: { BattleBoardComponent, EnemyInfoComponent, CAlert },

  data() {
    return {
      nickName: "Player",
      enemyNickName: "",
      enemyState: EnemyState.WAITING_FOR_ENEMY,
      topButtonDisabled: false,
      infoComponentVisible: false,
      alertVisible: false,
      alertText: "",
      alertColor: "danger",
      playButtonDisabled: true,
      endGameButtonDisabled: true,
      myTurnToShoot: false,
    };
  },

  computed: {
    ...mapGetters(["getWebSocket", "getClientUuid"]),
  },

  methods: {
    nicknameIsNullOrEmpty() {
      if (
        this.nickName === "" ||
        this.nickName === null ||
        this.nickName === undefined
      ) {
        return true;
      }

      return false;
    },

    clickRandomGameButtonHandle(event: MouseEvent) {
      if (this.nicknameIsNullOrEmpty()) {
        this.showAlert("Для игры необходимо ввести ник!", "warning");
        return;
      }

      const userRequestBody = {
        msg_type: MessageType.RANDOM_GAME,
        nickName: this.nickName,
      };

      let clientUUID = uuidv4();

      let ws: WebSocket = new WebSocket(
        `ws://127.0.0.1:5000/client/${clientUUID}/ws`
      );

      this.setupSocketConnectionAndCreateRivalCouple(
        ws,
        userRequestBody,
        clientUUID
      );
      this.topButtonDisabled = true;
      this.infoComponentVisible = true;
    },

    setupSocketConnectionAndCreateRivalCouple(
      ws: WebSocket,
      userRequestBody: Object,
      clientUuid: string
    ) {
      ws.onopen = function (event) {
        console.log("Successfully connected to the websocket server...");
        ActionStore.dispatch("createTeamPlayerWS", {
          ws,
          userRequestBody,
          clientUuid,
        });
      };

      const processData = this.processDataFromServer;
      ws.onmessage = function (event: MessageEvent<string>) {
        processData(event.data);
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
    },

    showAlert(alertText: string, alertColor: string = "danger") {
      this.alertColor = alertColor;
      this.alertText = alertText;
      this.alertVisible = true;
    },

    processDataFromServer(dataFromServer: string) {
      let parsedData: WSDataTransferRoot = JSON.parse(dataFromServer);

      console.log("data from server:", parsedData);

      switch (parsedData.msg_type) {
        case MessageType.RANDOM_GAME:
          if (parsedData.is_status_ok) {
            if (parsedData.data.enemy_nickname) {
              console.log("Enemy for random game successfully created");
              this.enemyNickName = parsedData.data.enemy_nickname;
              this.enemyState = EnemyState.SHIPS_POSITIONING;
              this.playButtonDisabled = false;
            }
          } else {
            this.showAlert("Возникла ошибка при поиске случайного соперника");
            console.log("Random enemy search error: ", parsedData.data);
          }

          break;

        case MessageType.DISCONNECTION:
          if (parsedData.is_status_ok)
            this.showAlert(
              "К сожалению, ваш соперник разорвал соединение и вышел из игры"
            );

          this.setInitialInputElementState();
          break;

        case MessageType.SHIPS_ARE_ARRANGED:
          if (parsedData.is_status_ok)
            this.enemyState = EnemyState.READY_TO_PLAY;
          break;

        case MessageType.PLAY:
          if (parsedData.is_status_ok) {
            this.enemyState = EnemyState.PLAYING;
            this.myTurnToShoot = parsedData.data.turn_to_shoot;
          }
          break;

        default:
          break;
      }
    },

    handlePlayButtonClick(event: Event) {
      const clientUuid = this.getClientUuid;
      if (!clientUuid) return;

      const ws: WebSocket = this.getWebSocket;

      ws.send(
        JSON.stringify({
          msg_type: MessageType.SHIPS_ARE_ARRANGED,
        })
      );

      if (event) (<HTMLButtonElement>event.target).disabled = true;
      this.endGameButtonDisabled = false;
      GameStore.commit("disableOwnGrid");
    },

    setInitialInputElementState() {
      this.enemyNickName = "";
      this.enemyState = EnemyState.WAITING_FOR_ENEMY;
      this.topButtonDisabled = false;
      this.infoComponentVisible = false;
      this.playButtonDisabled = true;
      this.endGameButtonDisabled = true;
    },
  },
});
</script>

<style lang="css" scoped>
#alert {
  width: 700px;
  position: fixed;
  left: 20px;
  top: 20px;
}

#enemy-component {
  border: 1px solid black;
  margin-top: 30px;
  margin-bottom: 30px;
  padding: 10px 20px 15px 20px;
}

.fit {
  width: fit-content;
}

.auto {
  margin-left: auto;
  margin-right: auto;
}

table > tbody > tr > td {
  padding: 0px 0px 15px 15px;
}

.btm-btn {
  margin: 20px 0px 0px 20px;
  width: 200px;
  height: 50px;
}

.top-btn {
  width: 300px;
  height: 50px;
}
</style>