<template>
  <div class="container">
    <div
      class="d-flex flex-row flex-wrap justify-content-lg-center justify-content-sm-between text-center"
    >
      <div class="me-lg-2 mb-4 border border-dark border-2 rounded-3 p-2">
        <table>
          <tbody>
            <tr>
              <td id="c1">
                <button
                  v-if="isReArrangeButtonVisible()"
                  class="btn p-0"
                  @click="rearrangeTheShips()"
                >
                  <img
                    id="img"
                    src="@/assets/refresh_ships.png"
                    alt="refresh_ships"
                  />
                </button>
              </td>
              <td id="c2">
                <span
                  v-show="turnOrderHintsVisible"
                  :class="{ blink: !isMyTurnToShoot }"
                  class="fw-bold darkred"
                >
                  <span v-show="!isMyTurnToShoot">ходит </span>
                  <span> {{ enemyNickname + " " }} </span
                  ><span v-show="enemyShotHint">{{
                    enemyShotHint
                  }}</span> </span
                ><span>&nbsp;</span>
              </td>
            </tr>
            <tr>
              <td colspan="2"><BattleGridWithCaptionsComponent /></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="ms-lg-2 mb-4 border border-dark border-2 rounded-3 p-2">
        <table>
          <tbody>
            <tr>
              <td>
                <span
                  v-show="turnOrderHintsVisible & isMyTurnToShoot"
                  class="blink fw-bold green"
                  >ваш ход</span
                ><span>&nbsp;</span>
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
</template>


<script lang="ts">
import { defineComponent } from "vue";
import BattleGridWithCaptionsComponent from "./BattleGridWithCaptionsComponent.vue";
import GridType from "@/model/enums/GridType";
import Game from "@/model/Game";
import { mapGetters } from "vuex";
import GameState from "@/model/enums/GameState";

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

  computed: {
    ...mapGetters(["getMyState"]),
  },

  methods: {
    rearrangeTheShips() {
      Game.rearrangeShips();
    },

    isReArrangeButtonVisible(): boolean {
      return (
        this.getMyState === GameState.NOT_CREATED ||
        this.getMyState === GameState.SEARCHING_FOR_OPPONENT ||
        this.getMyState === GameState.SHIPS_POSITIONING ||
        this.getMyState === GameState.WAITING_FOR_FRIEND
      );
    },
  },
});
</script>


<style lang="css" scoped>
img {
  width: 20px;
  height: 20px;
}

#c1 {
  width: 10%;
}

#c2 {
  width: 90%;
}
</style>