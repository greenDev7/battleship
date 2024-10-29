<template>
    <Ship class="inline" />
    <BattleGridComponent class="inline" />
    <BattleBoardComponent class="inline" />
</template>

<script lang="ts">
import BattleBoardComponent from '../components/BattleBoardComponent.vue'
import Ship from "../components/Ship.vue";
import BattleGridComponent from "../components/BattleGridComponent.vue";
import { defineComponent } from 'vue'
import GameStore from '@/store/modules/GameStore';

export default defineComponent({
    name: "BattleShipView",

    components: { BattleGridComponent, BattleBoardComponent, Ship },

    mounted() {
        console.log(GameStore.state.game);
    }
})
</script>

<style lang="css" scoped>
.inline {
    display: inline-block;
}
</style>