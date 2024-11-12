<template>
    <table class="scaling-height scaling-width">
        <tbody>
            <tr>
                <td></td>
                <td>
                    <table id="alphabeticTable">
                        <tbody>
                            <tr>
                                <td>а</td>
                                <td>б</td>
                                <td>в</td>
                                <td>г</td>
                                <td>д</td>
                                <td>е</td>
                                <td>ж</td>
                                <td>з</td>
                                <td>и</td>
                                <td>к</td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
            <tr class="scaling-height">
                <td class="scaling-height">
                    <table id="digitTable" class="scaling-height">
                        <tbody>
                            <tr>
                                <td>1</td>
                            </tr>
                            <tr>
                                <td>2</td>
                            </tr>
                            <tr>
                                <td>3</td>
                            </tr>
                            <tr>
                                <td>4</td>
                            </tr>
                            <tr>
                                <td>5</td>
                            </tr>
                            <tr>
                                <td>6</td>
                            </tr>
                            <tr>
                                <td>7</td>
                            </tr>
                            <tr>
                                <td>8</td>
                            </tr>
                            <tr>
                                <td>9</td>
                            </tr>
                            <tr>
                                <td>10</td>
                            </tr>
                        </tbody>
                    </table>
                </td>
                <td class="scaling-height scaling-width">
                    <BattleGridComponent :grid-type="gridType" />
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import BattleGridComponent from "./BattleGridComponent.vue";
import { mapGetters } from 'vuex';
import GridType from '@/model/GridType';

export default defineComponent({
    name: "BattleGridWithCaptionsComponent",

    components: { BattleGridComponent },

    props: {
        gridType: { type: String, default: GridType.Own },
    },

    computed: {
        ...mapGetters([
            "getCanvasWidth",
            "getCanvasHeight"
        ]),
    }
})
</script>

<style lang="css" scoped>
table,
tr,
td {
    /* border: 1px solid blue; */
    border-collapse: collapse;
    padding: 0px;
}

.scaling-height {
    height: 100%;
}

.scaling-width {
    width: 100%;
}

#digitTable>tbody>tr>td {
    /* padding-top: 3px; */
    padding-right: 7px;
}

#alphabeticTable {
    width: 100%;
}

#alphabeticTable>tbody>tr>td {
    width: 10%;
    padding-bottom: 5px;
}
</style>