<template>
    <canvas ref="canvas"></canvas>
</template>


<script lang="ts">
import Ship from '@/model/Ship';
import ShipType from '@/model/ShipType';
import { defineComponent } from 'vue';
import ship2Horizontal from '../assets/ship2Horizontal.png';
import ship2Vertical from '../assets/ship2Vertical.png';
import { mapGetters } from 'vuex';
import GameStore from '@/store';

export default defineComponent({
    name: "ShipComponent",

    props: {
        ship: { type: Ship, default: new Ship(2, ShipType.Vertical) },
    },

    data() {
        return {}
    },

    computed: {
        ...mapGetters([
            "getGridCellWidth",
            "getGridCellHeight"
        ]),
    },

    methods: {
        initialize() {
            let canvas = <HTMLCanvasElement>this.$refs.canvas;
            let ctx = canvas.getContext("2d");

            if (ctx) {
                const wh: [number, number] = this.determineCanvasDim(this.ship);
                ctx.canvas.width = wh[0];
                ctx.canvas.height = wh[1];

                this.bindImageToCanvas(ctx, this.ship, wh);
            }
        },

        bindImageToCanvas(ctx: CanvasRenderingContext2D, ship: Ship, shipWidthHeight: [number, number]) {
            let img = new Image();
            img.src = this.determineShipImage(this.ship);
            const sp = GameStore.state.scaleParameter;
            img.onload = () => { ctx.drawImage(img, 0, 0, img.width * sp, img.height * sp); };
        },

        determineShipImage(ship: Ship): string {
            let imgSourceString: string = "";

            if (ship.type === ShipType.Horizontal) {
                if (ship.size === 2) imgSourceString = ship2Horizontal;
            }
            else {
                if (ship.size === 2) imgSourceString = ship2Vertical;
            }

            return imgSourceString;
        },

        determineCanvasDim(ship: Ship): [number, number] {

            if (ship.type === ShipType.Horizontal) {
                return [this.getGridCellWidth * ship.size, this.getGridCellHeight];
            }
            else {
                return [this.getGridCellWidth, this.getGridCellHeight * ship.size];
            }
        }
    },

    mounted() {
        this.initialize();
    }
})

</script>

<style lang="css" scoped>
canvas {
    border: 1px solid blue;
}
</style>