<template>
  <table>
    <tbody>
      <tr>
        <td>{{ getEnemyCaption() }}</td>
      </tr>
      <tr>
        <td v-if="enemy">{{ gameTimer }}</td>
      </tr>
      <tr>
        <td v-if="enemy" class="green">Игра началась: Ваш ход</td>
      </tr>
    </tbody>
  </table>
</template>


<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters } from "vuex";

export default defineComponent({
  name: "InfoBoardComponent",

  props: {
    enemy: { type: String, default: "" },
  },

  computed: {
    ...mapGetters(["getEnemyStatusCaption"]),
  },

  data() {
    return {
      gameTimer: "01:23",
    };
  },

  methods: {
    getEnemyCaption() {
      if (this.enemy) {
        return "Ваш соперник: " + this.enemy;
      } else return "Поиск противника...";
    },
  },
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