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
    <InfoBoardComponent />
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
import InfoBoardComponent from "@/components/InfoBoardComponent.vue";

export default defineComponent({
  name: "BattleShipView",

  components: { BattleBoardComponent, InfoBoardComponent },

  data() {
    return {
      nickName: "Player",
      topButtonDisabled: false,
    };
  },

  methods: {
    clickRandomGameButtonHandle(event: MouseEvent) {
      if (
        this.nickName === "" ||
        this.nickName === null ||
        this.nickName === undefined
      ) {
        alert("Для игры необходимо ввести ник!");
        return;
      }

      const userRequestBody = {
        nickName: this.nickName,
        gameType: GameType.Random,
      };

      let ws: WebSocket = new WebSocket("ws://127.0.0.1:5000/ws");

      this.setupSocketConnectionAndCreateUser(ws, userRequestBody);
      this.topButtonDisabled = true;
    },

    setupSocketConnectionAndCreateUser(ws: WebSocket, userRequestBody: Object) {
      ws.onopen = function (event) {
        console.log("Successfully connected to the websocket server...");
        ActionStore.dispatch("createUserWS", {
          ws,
          userRequestBody,
        });
      };

      ws.onclose = function (event) {
        console.log("Successfully  disconnected from the websocket server...");
      };
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