<template>
  <table>
    <tbody>
      <tr>
        <td>
          <BattleGridWithCaptionsComponent
            :class="{ 'no-pointer-events': getOwnGridDisabled }"
          />
        </td>
        <td>
          <BattleGridWithCaptionsComponent
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

  components: { BattleGridWithCaptionsComponent },

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
</style>