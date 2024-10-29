<template>
    <canvas ref="canvas"></canvas>
</template>


<script lang="ts">
import Point2D from '@/model/Point2D';
import Ship from '@/model/Ship';
import { defineComponent } from 'vue';

export default defineComponent({
    name: "Ship",

    props: {
        gridCellLength: { type: Number, default: 30 },
        ship: { type: Ship, default: new Ship([new Point2D(0, 0), new Point2D(1, 0)]) }
    },

    data() {
        return {}
    },

    methods: {
        initialize() {
           
        }
    }
})

</script>

<style lang="css" scoped>
canvas {
    border: 1px solid blue;
}
</style>