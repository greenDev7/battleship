<template>
  <table>
    <tbody>
      <tr>
        <td>{{ findEnemyCaption }}</td>
      </tr>
      <tr>
        <td>{{ gameTimer }}</td>
      </tr>
      <tr>
        <td class="green">
            Игра началась: Ваш ход
        </td>
      </tr>
    </tbody>
  </table>
</template>


<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "InfoBoardComponent",

  data() {
    return {
      findEnemyCaption: "Cоперник: Player 3",
      gameTimer: "01:23",
    };
  },
});
</script>

<style lang="css"  scoped>
table {
  border: 2px solid;
  border-collapse: collapse;
}

table > tbody > tr > td  {
    padding: 10px 15px 10px 15px;
}

.green {
    color: rgb(100, 220, 180);
    font-weight: bold;
}
</style>