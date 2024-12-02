<template>
  <table>
    <tbody>
      <tr>
        <td class="small darkred">
          <span v-show="turnOrderHintsVisible & !isMyTurnToShoot">
            <span>ход соперника </span><span>(к-9)</span>
          </span>
        </td>
        <td class="small green">
          <span v-show="turnOrderHintsVisible & isMyTurnToShoot">ваш ход</span>
        </td>
      </tr>
      <tr>
        <td>
          <BattleGridWithCaptionsComponent
            :class="{ 'no-pointer-events': getOwnGridDisabled }"
          />
        </td>
        <td>
          <BattleGridWithCaptionsComponent
            :class="{ 'no-pointer-events': !isMyTurnToShoot }"
            @hostile-grid-click="(e) => $emit('hostile-grid-click', e)"
            :gridType="hostileGrid"
          />
        </td>
      </tr>
    </tbody>
  </table>
</template>


<script lang="ts">
import { defineComponent } from "vue";
import BattleGridWithCaptionsComponent from "./BattleGridWithCaptionsComponent.vue";
import GridType from "@/model/GridType";
import { mapGetters } from "vuex";

export default defineComponent({
  name: "BattleBoardComponent",

  emits: ["hostile-grid-click"],

  components: { BattleGridWithCaptionsComponent },

  props: {
    isMyTurnToShoot: { type: Boolean, default: false },
    turnOrderHintsVisible: { type: Boolean, default: false },
  },

  computed: {
    ...mapGetters(["getOwnGridDisabled"]),
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

.no-pointer-events {
  pointer-events: none;
}

.green {
  color: rgb(66, 185, 131);
  font-weight: bold;
}

.darkred {
  color: rgb(146, 42, 38);
  font-weight: bold;
}
</style>