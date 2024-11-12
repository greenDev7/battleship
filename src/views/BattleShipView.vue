<template>
    <p><label for="scale">Масштаб</label></p>
    <input type="range" id="scale" min="0.2" max="1" step="0.05" v-model="scaleParameter">
    <BattleBoardComponent/>
</template>

<script lang="ts">
import GameStore from '@/store';
import BattleBoardComponent from '../components/BattleBoardComponent.vue'
import { defineComponent } from 'vue'

export default defineComponent({
    name: "BattleShipView",

    components: { BattleBoardComponent },

    computed: {
        scaleParameter: {
            get() {
                return GameStore.state.gameScale;
            },

            set(value: number) {
                GameStore.commit("updateGameScaleParameter", value);
            }

        }
    }

})
</script>

<style lang="css" scoped></style>