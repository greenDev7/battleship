<template>
  <table>
    <tbody>
      <tr>
        <td>{{ getEnemyStatusCaption }}</td>
      </tr>
      <tr>
        <td>{{ gameTimer }}</td>
      </tr>
      <tr>
        <td class="green">Игра началась: Ваш ход</td>
      </tr>
    </tbody>
  </table>
</template>


<script lang="ts">
import { GameStore } from "@/store/modules/GameStore";
import { defineComponent } from "vue";
import { mapGetters } from "vuex";

export default defineComponent({
  name: "InfoBoardComponent",

  computed: {
    ...mapGetters(["getEnemyStatusCaption"]),
  },

  data() {
    return {
      gameTimer: "01:23",
    };
  },

  mounted() {
    console.log(GameStore.state.gridLineThickness);
  }
});
</script>

<style lang="css"  scoped>
table {
  border: 2px solid;
  border-collapse: collapse;
}

table > tbody > tr > td {
  padding: 10px 15px 10px 15px;
}

.green {
  color: rgb(100, 220, 180);
  font-weight: bold;
}
</style>