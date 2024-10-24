<template>
    <table id="container">
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

    components: { BattleGridWithCaptionsComponent }
})
</script>


<style lang="css" scoped>
table {
    border-collapse: collapse;
    /* border: 1px solid red; */
}

td {
    padding-left: 15px;
}
</style>