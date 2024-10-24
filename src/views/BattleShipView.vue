<template>
    <BattleBoardComponent id="board"></BattleBoardComponent>
</template>

<script lang="ts">
import BattleBoardComponent from '../components/BattleBoardComponent.vue'

export default {
    name: "BattleShipView",

    components: { BattleBoardComponent }
}
</script>

<style lang="css" scoped>
#board {
    margin-left: auto;
    margin-right: auto;
}
</style>