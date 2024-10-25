<template>
    <table>
        <tbody>
            <tr>
                <td>
                    <BattleGridWithCaptionsComponent :canvasWidth=canvasWidth :canvasHeight=canvasHeight />
                </td>
                <td>
                    <BattleGridWithCaptionsComponent :canvasWidth=canvasWidth :canvasHeight=canvasHeight
                        :gridType="'hostile'" />
                </td>
            </tr>
        </tbody>
    </table>
</template>


<script>
import { defineComponent } from 'vue'
import BattleGridWithCaptionsComponent from './BattleGridWithCaptionsComponent.vue';

export default defineComponent({
    name: "BattleBoardComponent",

    components: { BattleGridWithCaptionsComponent },

    props: {
        canvasWidth: { type: Number, default: 300 },
        canvasHeight: { type: Number, default: 300 },
    }
})
</script>


<style lang="css" scoped>
td {
    padding-left: 15px;
}
</style>