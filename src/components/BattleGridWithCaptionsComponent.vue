<template>
    <table>
        <tbody>
            <tr>
                <td></td>
                <td>
                    <canvas id="alphabeticCanvas" ref="alphabeticCanvas" class="canvas" :style="getAlphabeticCanvasStyle()"></canvas>
                </td>
            </tr>
            <tr>
                <td><canvas id="digitalCanvas" ref="digitalCanvas" class="canvas" :style="getDigitalCanvasStyle()"></canvas></td>
                <td>
                    <BattleGridComponent :canvasWidth="canvasWidth" :canvasHeight="canvasHeight" />
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import BattleGridComponent from './BattleGridComponent.vue';

export default defineComponent({
    name: "BattleGridWithCaptionsComponent",

    components: { BattleGridComponent },

    props: {
        canvasWidth: { type: Number, default: 350 },
        canvasHeight: { type: Number, default: 350 },
    },

    data() {
        let alphabeticCanvasHeight = this.canvasWidth / 10;
        let digitalCanvasWidth = this.canvasHeight / 10;
        return {
            alphabeticCanvasHeight: alphabeticCanvasHeight,
            digitalCanvasWidth: digitalCanvasWidth
        }
    },

    methods: {
        getAlphabeticCanvasStyle() {
            return {
                width: this.canvasWidth + 'px',
                height: this.alphabeticCanvasHeight + 'px',
                'border': '1px solid blue'
            }
        },

        getDigitalCanvasStyle() {
            return {
                width: this.digitalCanvasWidth + 'px',
                height: this.canvasHeight + 'px',
                'border': '1px solid blue'
            }
        },

        makeAlphabeticCanvasGrid() {
            let canvas = <HTMLCanvasElement>this.$refs.alphabeticCanvas;
            let ctx = canvas.getContext("2d");

            if (ctx) {
                ctx.canvas.width = this.canvasWidth;
                ctx.canvas.height = this.alphabeticCanvasHeight;

                ctx.beginPath();

                ctx.lineWidth = 0.2;
                ctx.setLineDash([]);

                for (let x = 0; x <= this.canvasWidth; x += this.alphabeticCanvasHeight) {
                    ctx.moveTo(x, 0);
                    ctx.lineTo(x, this.alphabeticCanvasHeight);
                };

                ctx.stroke();
            }
        },

        makeDigitalCanvasGrid() {
            let canvas = <HTMLCanvasElement>this.$refs.digitalCanvas;
            let ctx = canvas.getContext("2d");

            if (ctx) {
                ctx.canvas.width = this.digitalCanvasWidth;
                ctx.canvas.height = this.canvasHeight;

                ctx.beginPath();

                ctx.lineWidth = 0.2;
                ctx.setLineDash([]);

                for (let y = 0; y <= this.canvasHeight; y += this.digitalCanvasWidth) {
                    ctx.moveTo(0, y);
                    ctx.lineTo(this.digitalCanvasWidth, y);
                };

                ctx.stroke();
            }
        }
    },

    mounted() {
        this.makeAlphabeticCanvasGrid();
        this.makeDigitalCanvasGrid();
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

canvas {
    display: block;
}
</style>