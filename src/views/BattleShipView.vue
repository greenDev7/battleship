<template>
    <BattleGridComponent class="inline" />
    <BattleBoardComponent :canvasWidth="300" :canvasHeight="300" id="board" class="inline" />
</template>

<script lang="ts">
import BattleBoardComponent from '../components/BattleBoardComponent.vue'
import BattleGridComponent from "../components/BattleGridComponent.vue";

export default {
    name: "BattleShipView",

    components: { BattleGridComponent, BattleBoardComponent }
}
</script>

<style lang="css" scoped>
.inline {
    display: inline-block;
}
</style>