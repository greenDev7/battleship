<template>
    <BattleGridComponent :x-size="5" :y-size="7" />
</template>


<script lang="ts">
import { defineComponent } from 'vue';
import BattleGridComponent from "../components/BattleGridComponent.vue";

export default defineComponent({
    name: "FleetComponent",

    components: { BattleGridComponent }

})
</script>


<style lang="css" scoped>
/* table {
    border: 1px solid blue;
} */
</style>