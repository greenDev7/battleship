<template>
  <div id="container">
    <BattleBoardComponent />
    <button type="submit">Играть!</button>
    <button type="submit">Сдаться</button>
  </div>
</template>

<script lang="ts">
import BattleBoardComponent from "../components/BattleBoardComponent.vue";
import { defineComponent } from "vue";

export default defineComponent({
  name: "BattleShipView",

  components: { BattleBoardComponent },
});
</script>

<style lang="css" scoped>
#container {
  width: fit-content;
  text-align: center;
}

button {
  width: 200px;
  height: 50px;
  margin: 50px 30px;
}
</style>