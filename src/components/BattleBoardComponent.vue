<template>
    <table>
        <tbody>
            <tr>
                <td>
                    <BattleGridWithCaptionsComponent />
                </td>
                <td>
                    <BattleGridWithCaptionsComponent :gridType="'hostile'" />
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
})
</script>


<style lang="css" scoped>
td {
    padding-left: 15px;
}
</style>