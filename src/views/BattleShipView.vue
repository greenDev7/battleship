<template>
    <div class="mainTableRow2">
        <p><label for="scale">Масштаб</label></p>
        <input type="range" id="scale" min="0.7" max="1.3" step="0.1" v-model="scaleParameter2">
    </div>
    <BattleBoardComponent class="inline" />
</template>

<script lang="ts">
import GameStore from '@/store';
import BattleBoardComponent from '../components/BattleBoardComponent.vue'
import { defineComponent } from 'vue'

export default defineComponent({
    name: "BattleShipView",

    components: { BattleBoardComponent },

    computed: {
        scaleParameter2: {

            get() {
                return GameStore.state.scaleParameter;
            },

            set(value: number) {
                GameStore.commit("updateScaleParameter", value);
            }

        }
    }

})
</script>

<style lang="css" scoped>
.inline {
    display: inline-block;
}
</style>