<template>
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
</template>


<script>
import { defineComponent } from 'vue'
import BattleGridWithCaptionsComponent from './BattleGridWithCaptionsComponent.vue';
import GridType from '@/model/GridType';

export default defineComponent({
    name: "BattleBoardComponent",

    components: { BattleGridWithCaptionsComponent },

    data() {
        return {
            hostileGrid: GridType.Hostile
        }
    }
})
</script>


<style lang="css" scoped>
td {
    padding-left: 15px;
}
</style>