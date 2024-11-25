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
    <InfoBoardComponent v-if="showInformComponent" />
    <BattleBoardComponent />
    <button class="btm-btn" type="submit">Играть</button>
    <button class="btm-btn" type="submit">Завершить игру</button>
  </div>
</template>

<script lang="ts">
import BattleBoardComponent from "../components/BattleBoardComponent.vue";
import { defineComponent } from "vue";
import ActionStore from "@/store/index";
import GameType from "@/model/GameType";
import MessageType from "@/model/MessageType";
import InfoBoardComponent from "@/components/InfoBoardComponent.vue";
import { v4 as uuidv4 } from "uuid";
import WSDataTransfer from "@/model/WSDataTransfer";

export default defineComponent({
  name: "BattleShipView",

  components: { BattleBoardComponent, InfoBoardComponent },

  data() {
    return {
      nickName: "Player",
      enemyNickName: "",
      topButtonDisabled: false,
      showInformComponent: false,
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
        alert("Для игры необходимо ввести ник!");
        return;
      }

      ActionStore.dispatch("nickNameExists", this.nickName)
        .then((response) => {
          if (response.data) {
            console.log("response.data: ", response.data);
            alert("Игрок с таким ником уже существует, придумайте другой ник!");
          } else {
            const userRequestBody = {
              msg_type: MessageType.AU_RG_CREATION,
              nickName: this.nickName,
              gameType: GameType.Random,
            };

            let clientUUID = uuidv4();

            let ws: WebSocket = new WebSocket(
              `ws://127.0.0.1:5000/client/${clientUUID}/ws`
            );

            this.setupSocketConnectionAndCreateUser(ws, userRequestBody);
            this.topButtonDisabled = true;
            this.showInformComponent = true;
          }
        })
        .catch((error) => {
          alert("Возникла ошибка при проверке ника в БД!");
          console.log("Возникла ошибка при проверке ника в БД:", error);
        });
    },

    setupSocketConnectionAndCreateUser(ws: WebSocket, userRequestBody: Object) {
      ws.onopen = function (event) {
        console.log("Successfully connected to the websocket server...");

        ActionStore.dispatch("createActiveUserWS", { ws, userRequestBody });
      };

      const processData = this.processDataFromServer;
      ws.onmessage = function (event: MessageEvent<string>) {
        console.log("Message from server: ", event.data);
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
      let parsedData: WSDataTransfer = JSON.parse(dataFromServer);

      switch (parsedData.msg_type) {
        case MessageType.AU_RG_CREATION:
          if (parsedData.status == "ok")
            console.log("Игрок для рандомной игры успешно создан");
          if (parsedData.data)


          break;

        default:
          break;
      }
    },
  },
});
</script>

<style lang="css" scoped>
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