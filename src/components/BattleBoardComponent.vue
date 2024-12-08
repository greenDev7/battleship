<template>
  <table>
    <tbody>
      <tr>
        <td class="small darkred">
          <span
            v-show="turnOrderHintsVisible"
            :class="{ blink: !isMyTurnToShoot }"
          >
            <span v-show="!isMyTurnToShoot">ходит </span>
            <span> {{ enemyNickname + " " }} </span
            ><span v-show="enemyShotHint">{{ enemyShotHint }}</span>
          </span>
        </td>
        <td class="small green">
          <span v-show="turnOrderHintsVisible & isMyTurnToShoot" class="blink"
            >ваш ход</span
          >
        </td>
      </tr>
      <tr>
        <td>
          <BattleGridWithCaptionsComponent />
        </td>
        <td>
          <BattleGridWithCaptionsComponent :gridType="hostileGrid" />
        </td>
      </tr>
    </tbody>
  </table>
</template>


<script lang="ts">
import { defineComponent } from "vue";
import BattleGridWithCaptionsComponent from "./BattleGridWithCaptionsComponent.vue";
import GridType from "@/model/enums/GridType";

export default defineComponent({
  name: "BattleBoardComponent",

  components: { BattleGridWithCaptionsComponent },

  props: {
    isMyTurnToShoot: { type: Boolean, default: false },
    turnOrderHintsVisible: { type: Boolean, default: false },
    enemyShotHint: { type: String, default: "" },
    enemyNickname: { type: String, default: "" },
    // shotHintVisible: { type: Boolean, default: false },
  },

  data() {
    return {
      hostileGrid: GridType.Hostile,
    };
  },
});
</script>


<style lang="css" scoped>
td {
  padding-left: 15px;
}

.green {
  color: rgb(66, 185, 131);
  font-weight: bold;
}

.darkred {
  color: rgb(146, 42, 38);
  font-weight: bold;
}

.blink {
  animation: blink-animation 2s steps(5, start) infinite;
  -webkit-animation: blink-animation 2s steps(5, start) infinite;
}

@keyframes blink-animation {
  to {
    visibility: hidden;
  }
}

@-webkit-keyframes blink-animation {
  to {
    visibility: hidden;
  }
}
</style>