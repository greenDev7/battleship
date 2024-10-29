<template>
    <BattleGridComponent class="inline" :grid-type=fleetGrid />
    <BattleBoardComponent class="inline" />
</template>

<script lang="ts">
import GridType from '@/model/GridType';
import BattleBoardComponent from '../components/BattleBoardComponent.vue'
import BattleGridComponent from "../components/BattleGridComponent.vue";
import { defineComponent } from 'vue'

export default defineComponent({
    name: "BattleShipView",

    components: { BattleGridComponent, BattleBoardComponent },

    data() {
        return {
            fleetGrid: GridType.Fleet
        }
    }
})
</script>

<style lang="css" scoped>
.inline {
    display: inline-block;
}
</style>