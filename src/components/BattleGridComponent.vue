<template>
    <canvas id="canvas" ref="canvas"></canvas>
</template>


<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    props: {
        gridType: { type: String, default: "Mine" },
        canvasWidth: { type: Number, default: 300 },
        canvasHeight: { type: Number, default: 300 },
        gridLineThickness: { type: Number, default: 0.2 },
    },

    data() {

        return {}
    },

    methods: {
        initialize() {
            let canvas = <HTMLCanvasElement> this.$refs.canvas;
            let ctx = canvas.getContext("2d");

            if (ctx) {
                ctx.canvas.width = this.canvasWidth;
                ctx.canvas.height = this.canvasHeight;

                // Рисуем сетку
                this.makeGrid(ctx, this.gridLineThickness);
            };
        },

        makeGrid(ctx: CanvasRenderingContext2D, thickness: number) {
            let squareLength = this.canvasWidth / 10;

            ctx.beginPath();

            ctx.lineWidth = thickness;
            ctx.setLineDash([]);

            for (let x = 0; x <= this.canvasWidth; x += squareLength) {
                ctx.moveTo(x, 0);
                ctx.lineTo(x, this.canvasHeight);
            };

            for (let y = 0; y <= this.canvasHeight; y += squareLength) {
                ctx.moveTo(0, y);
                ctx.lineTo(this.canvasWidth, y);
            };

            ctx.stroke();
        }
    },

    mounted() {
        this.initialize();
    },
})
</script>


<style lang="css" scoped>
#canvas {
    border: 1px dashed rgb(99, 99, 99);
    display: block;
}
</style>