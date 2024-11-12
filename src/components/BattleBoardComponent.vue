<template>
    <div :style="{ height: this.getGameHeight + 'px', width: this.getGameWidth + 'px'}">
        <table>
            <tbody>
                <tr>
                    <td>
                        <BattleGridWithCaptionsComponent />
                    </td>
                    <td>
                        <BattleGridWithCaptionsComponent :gridType=hostileGrid />
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>


<script>
import { defineComponent } from 'vue'
import BattleGridWithCaptionsComponent from './BattleGridWithCaptionsComponent.vue';
import GridType from '@/model/GridType';
import GameStore from '@/store';
import { mapGetters } from 'vuex';

export default defineComponent({
    name: "BattleBoardComponent",

    components: { BattleGridWithCaptionsComponent },

    data() {
        return {
            hostileGrid: GridType.Hostile,
            gameInitialWidth: GameStore.state.gameInitialWidth,
            gameInitialHeight: GameStore.state.gameInitialHeight,
        }
    },

    computed: {
        ...mapGetters([
            "getGameWidth",
            "getGameHeight"
        ]),
    },
})
</script>


<style lang="css" scoped>
td {
    padding-left: 15px;
}

table, tr {
    width: 100%;
    height: 100%;
}
</style>