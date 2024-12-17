<template>
  <div class="container">
    <div
      class="d-flex flex-row flex-wrap justify-content-lg-center justify-content-sm-between text-center"
    >
      <div class="me-lg-2">
        <table>
          <tbody>
            <tr>
              <td>
                <span
                  v-show="turnOrderHintsVisible"
                  :class="{ blink: !isMyTurnToShoot }"
                >
                  <span v-show="!isMyTurnToShoot">ходит </span>
                  <span> {{ enemyNickname + " " }} </span
                  ><span v-show="enemyShotHint">{{ enemyShotHint }}</span>
                </span>
              </td>
            </tr>
            <tr>
              <td><BattleGridWithCaptionsComponent /></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="ms-lg-2">
        <table>
          <tbody>
            <tr>
              <td>
                <span
                  v-show="turnOrderHintsVisible & isMyTurnToShoot"
                  class="blink"
                  >ваш ход</span
                >
              </td>
            </tr>
            <tr>
              <td>
                <BattleGridWithCaptionsComponent :gridType="hostileGrid" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- <table>
    <tbody>
      <tr>
        <td class="small darkred"></td>
        <td class="small green"></td>
      </tr>
      <tr>
        <td></td>
        <td></td>
      </tr>
    </tbody>
  </table> -->
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
  },

  data() {
    return {
      hostileGrid: GridType.Hostile,
    };
  },
});
</script>


<style lang="css" scoped>
</style>