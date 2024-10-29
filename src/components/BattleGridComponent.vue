<template>
    <div :style="{ height: getCanvasHeight + 'px' }">
        <canvas ref="canvas"></canvas>
    </div>
</template>


<script lang="ts">
import Ship from '@/model/Ship';
import ShipType from '@/model/ShipType';
import store from '@/store/modules/GameStore';

import { defineComponent, PropType } from 'vue'
import { mapGetters } from 'vuex';

export default defineComponent({

    name: "BattleGridComponent",

    props: {
        gridType: { type: String, default: "Mine" },
        ships: { type: Array as PropType<Ship[]>, default: () => [new Ship(2, ShipType.Horizontal)] }
    },

    data() {
        return {}
    },

    computed: {
        ...mapGetters([
            "getCanvasWidth",
            "getCanvasHeight",
            "getGridCellWidth",
            "getGridCellHeight"
        ]),
    },

    methods: {
        initialize() {
            let canvas = <HTMLCanvasElement>this.$refs.canvas;
            let ctx = canvas.getContext("2d");

            if (ctx) {
                ctx.canvas.width = this.getCanvasWidth;
                ctx.canvas.height = this.getCanvasHeight;

                // Рисуем сетку
                this.makeGrid(ctx, store.state.gridLineThickness);

                this.arrangeShips(ctx);
            };
        },

        makeGrid(ctx: CanvasRenderingContext2D, thickness: number) {
            let ySquareLength = this.getCanvasHeight / store.state.numberOfCellsOnTheAxisY;

            ctx.beginPath();

            ctx.lineWidth = thickness;
            ctx.setLineDash([3, 3]);

            for (let x = 0; x <= this.getCanvasWidth; x += this.getGridCellWidth) {
                ctx.moveTo(x, 0);
                ctx.lineTo(x, this.getCanvasHeight);
            };

            for (let y = 0; y <= this.getCanvasHeight; y += this.getGridCellHeight) {
                ctx.moveTo(0, y);
                ctx.lineTo(this.getCanvasWidth, y);
            };

            ctx.stroke();
        },

        arrangeShips(ctx: CanvasRenderingContext2D) {

        },
    },

    mounted() {
        this.initialize();
    },
})
</script>


<style lang="css" scoped>
canvas {
    border: 1px dashed rgb(99, 99, 99);
}
</style>