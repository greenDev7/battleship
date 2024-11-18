<template>
  <div id="container">
    <table>
      <tbody>
        <tr>
          <td>
            <input type="text" name="fname" placeholder="Player" />
          </td>
        </tr>
        <tr>
          <td>
            <button class="top-btn" @click="clickRandomGameButtonHandle">
              Игра со случайным соперником
            </button>
          </td>
        </tr>
        <tr>
          <td>
            <button class="top-btn" type="submit">Игра с другом</button>
          </td>
        </tr>
        <tr>
          <td>
            <button class="top-btn" type="submit">Игра с компьютером</button>
          </td>
        </tr>
      </tbody>
    </table>

    <BattleBoardComponent />
    <button class="btm-btn" type="submit">Играть</button>
    <button class="btm-btn" type="submit">Завершить игру</button>
  </div>
</template>

<script lang="ts">
import BattleBoardComponent from "../components/BattleBoardComponent.vue";
import { defineComponent } from "vue";
import { ActionStore } from "@/store";

export default defineComponent({
  name: "BattleShipView",

  components: { BattleBoardComponent },

  methods: {
    clickRandomGameButtonHandle(event: MouseEvent) {
      console.log("clickRandomGameButtonHandle");
      ActionStore.dispatch("createUser", {
        id: "6f3036fd-af70-45b6-be76-12cadc95f157",
        dfname: "Player",
        dfemail: "grrtsgs@gmail.com",
      });
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