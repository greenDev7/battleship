<template>
    <table>
        <tbody>
            <tr>
                <td></td>
                <td></td>
                <td>
                    <canvas id="alphabeticCanvas" ref="alphabeticCanvas" class="canvas"
                        :style="getAlphabeticCanvasStyle()"></canvas>
                </td>
            </tr>
            <tr>
                <td style="display: block;">
                
                    <table class="inner">
                    <tbody>
                        <tr><td>1</td></tr>                        
                        <tr><td>2</td></tr>                        
                        <tr><td>3</td></tr>                        
                        <tr><td>4</td></tr>                        
                        <tr><td>5</td></tr>                        
                        <tr><td>6</td></tr>                        
                        <tr><td>7</td></tr>                        
                        <tr><td>8</td></tr>                        
                        <tr><td>9</td></tr>                        
                        <tr><td>10</td></tr>                        
                    </tbody>
                
                    </table>
       
                </td>            
                <td><canvas id="digitalCanvas" ref="digitalCanvas" class="canvas"
                        :style="getDigitalCanvasStyle()"></canvas></td>
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
import digitsBitmap from "../assets/digits1.png";

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
                // 'border': '1px solid blue'
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
            let canvas = <HTMLCanvasElement>this.$refs['digitalCanvas'];
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
        },

        drawDigits() {
            let canvas = <HTMLCanvasElement>this.$refs['digitalCanvas'];
            let ctx = canvas.getContext("2d");

            if (ctx) {
                ctx.canvas.width = this.digitalCanvasWidth;
                ctx.canvas.height = this.canvasHeight;

                this.bindImageToCanvas(ctx, digitsBitmap, 75, 660);
            }
        },

        bindImageToCanvas(ctx: CanvasRenderingContext2D, imgSrcString: string, sourceImgWidth: number, sourceImgHeight: number) {
            let img = new Image();
            img.src = imgSrcString;
            img.onload = () => {
                let sWidth: number = sourceImgWidth;
                let sHeight: number = sourceImgHeight / 10;

                let dl: number = this.digitalCanvasWidth;

                for (let i = 0; i < 10; i++) {
                    ctx.drawImage(img, 0 + 5, i * sHeight + 1, sWidth, sHeight - 1, 0, i * dl, dl, dl);   
                }
            };
        }
    },

    mounted() {
        this.makeAlphabeticCanvasGrid();
        // this.makeDigitalCanvasGrid();
        this.drawDigits();
    }
})
</script>

<style lang="css" scoped>
table,
tr,
td {
    border: 1px solid blue;
    border-collapse: collapse;
    padding: 0px;
}

.canvas {
    display: block;
}

.inner {
    height: 350px;
}

.inner > tbody> tr > td {
    padding-top: 4px;
}
</style>