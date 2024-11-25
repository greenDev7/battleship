<template>
  <table>
    <tbody>
      <tr>
        <td>
          <span>{{ getEnemyCaption() }}</span>
          <span class="darkred">{{ enemyNickName }}</span>
        </td>
      </tr>
      <!-- <tr>
        <td v-if="enemyNickName">{{ gameTimer }}</td>
      </tr> -->
      <tr>
        <td v-if="enemyNickName" class="green">
          Расставьте корабли и нажмите кнопку "Играть"
        </td>
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
    enemyNickName: { type: String, default: "" },
    enemyState: { type: String, default: "расставляет корабли..." },
  },

  data() {
    return {
      gameTimer: "01:23",
    };
  },

  methods: {
    getEnemyCaption() {
      if (this.enemyNickName) {
        return "Ваш противник: ";
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

.darkred {
  color: rgb(146, 42, 38);
  font-weight: bold;
}
</style>