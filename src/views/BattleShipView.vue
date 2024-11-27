<template>
  <div id="container">
    <table>
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
      v-if="infoComponentVisible"
      :enemyNickName="this.enemyNickName"
    />
    <BattleBoardComponent />
    <button class="btm-btn" type="submit">Играть</button>
    <button class="btm-btn" type="submit">Завершить игру</button>
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

export default defineComponent({
  name: "BattleShipView",

  components: { BattleBoardComponent, EnemyInfoComponent, CAlert },

  data() {
    return {
      nickName: "Player",
      enemyNickName: "",
      topButtonDisabled: false,
      infoComponentVisible: false,
      alertVisible: false,
      alertText: "",
      alertColor: "danger",
    };
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
        this.alertColor = "warning";
        this.alertText = "Для игры необходимо ввести ник!";
        this.alertVisible = true;
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

      this.setupSocketConnectionAndCreateRivalCouple(ws, userRequestBody);
      this.topButtonDisabled = true;
      this.infoComponentVisible = true;
    },

    setupSocketConnectionAndCreateRivalCouple(
      ws: WebSocket,
      userRequestBody: Object
    ) {
      ws.onopen = function (event) {
        console.log("Successfully connected to the websocket server...");
        ActionStore.dispatch("createTeamPlayerWS", { ws, userRequestBody });
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

    processDataFromServer(dataFromServer: string) {
      let parsedData: WSDataTransferRoot = JSON.parse(dataFromServer);

      console.log("data from server:", parsedData);

      switch (parsedData.msg_type) {
        case MessageType.RANDOM_GAME:
          if (parsedData.is_status_ok) {
            if (parsedData.data.enemy_nickname) {
              console.log("Enemy for random game successfully created");
              this.enemyNickName = parsedData.data.enemy_nickname;
            }
          } else {
            this.alertText = "Возникла ошибка при поиске случайного соперника";
            this.alertVisible = true;
            console.log("Random enemy search error: ", parsedData.data);
          }

          break;

        case MessageType.DISCONNECTION:
          if (parsedData.is_status_ok) {
            this.alertColor = "danger";
            this.alertText = "Ваш соперник разорвал соединение и вышел из игры";
            this.alertVisible = true;
          }

        default:
          break;
      }
    },
  },
});
</script>

<style lang="css" scoped>
#alert {
  width: 700px;
  position: absolute;
  left: 20px;
  top: 20px;
}

#container {
  /* width: fit-content; */
  text-align: center;
}

table {
  /* border: 1px solid; */
  margin: 0px auto 20px auto;
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