<template>
    <ShipComponent class="inline" />
    <BattleGridComponent class="inline" />
    <BattleBoardComponent class="inline" />
</template>

<script lang="ts">
import BattleBoardComponent from '../components/BattleBoardComponent.vue'
import ShipComponent from "../components/ShipComponent.vue";
import BattleGridComponent from "../components/BattleGridComponent.vue";
import { defineComponent } from 'vue'

export default defineComponent({
    name: "BattleShipView",

    components: { BattleGridComponent, BattleBoardComponent, ShipComponent },

    mounted() {
    }
})
</script>

<style lang="css" scoped>
.inline {
    display: inline-block;
}
</style>