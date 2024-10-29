<template>
    <table>
        <tbody>
            <tr>
                <td></td>
                <td :style="{ width: getCanvasWidth + 'px' }">
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
            <tr :style="{ height: getCanvasHeight + 'px' }">
                <td id="digitCell">
                    <table id="digitTable">
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
                <td>
                    <BattleGridComponent />
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import BattleGridComponent from './BattleGridComponent.vue';
import { mapGetters } from 'vuex';

export default defineComponent({
    name: "BattleGridWithCaptionsComponent",

    components: { BattleGridComponent },

    props: {
        gridType: { type: String, default: "Mine" },
    },

    computed: {
        ...mapGetters([
            "getCanvasWidth",
            "getCanvasHeight"
        ]),
    },

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

#digitTable>tbody>tr>td {
    padding-top: 3px;
    padding-right: 7px;
}

#digitCell {
    height: inherit;
}

#digitTable {
    height: 100%;
}

#alphabeticTable {
    width: 100%;
}

#alphabeticTable>tbody>tr>td {
    width: 10%;
    padding-bottom: 5px;
}
</style>