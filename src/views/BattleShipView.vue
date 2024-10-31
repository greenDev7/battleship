<template>
    <BattleBoardComponent class="inline" />
</template>

<script lang="ts">
import BattleBoardComponent from '../components/BattleBoardComponent.vue'
import { defineComponent } from 'vue'

export default defineComponent({
    name: "BattleShipView",

    components: { BattleBoardComponent },
})
</script>

<style lang="css" scoped>
.inline {
    display: inline-block;
}
</style>