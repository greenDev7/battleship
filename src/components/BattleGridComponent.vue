<template>
    <div :style="{ height: getCanvasHeight + 'px' }">
        <canvas ref="canvas"></canvas>
    </div>
</template>


<script lang="ts">

import Ship from '@/model/Ship';
import ShipType from '@/model/ShipType';
import store from '@/store/modules/GameStore';

import ship1 from "../assets/ship1.png"
import ship2Horizontal from "../assets/ship2Horizontal.png";
import ship2Vertical from "../assets/ship2Vertical.png";
import ship3Horizontal from "../assets/ship3Horizontal.png";
import ship3Vertical from "../assets/ship3Vertical.png";
import ship4Horizontal from "../assets/ship4Horizontal.png";
import ship4Vertical from "../assets/ship4Vertical.png";

import { defineComponent, PropType } from 'vue'
import { mapGetters } from 'vuex';
import GameStore from '@/store/modules/GameStore';
import GridType from '@/model/GridType';
import Location from '@/model/Location';
import GameEventHandler from '@/model/GameEventHandler';

export default defineComponent({

    name: "BattleGridComponent",

    props: {
        gridType: { type: String, default: GridType.Own },
    },

    computed: {
        ...mapGetters([
            "getCanvasWidth",
            "getCanvasHeight",
            "getGridCellWidth",
            "getGridCellHeight",
            "getShipByLocation"
        ]),
    },

    methods: {
        makeGrid(ctx: CanvasRenderingContext2D, thickness: number) {
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

        drawShips(ctx: CanvasRenderingContext2D) {
            for (const ship of GameStore.state.ships)
                this.drawSingleShip(ctx, ship);
        },

        drawSingleShip(ctx: CanvasRenderingContext2D, ship: Ship) {
            let img = new Image();
            img.src = this.determineShipImage(ship);
            const sp = GameStore.state.scaleParameter;
            img.onload = () => {
                ctx.drawImage(img, ship.loc.x * this.getGridCellWidth,
                    ship.loc.y * this.getGridCellHeight, img.width * sp, img.height * sp);
            };
        },

        determineShipImage(ship: Ship): string {
            let imgSourceString: string = "";

            console.log('ship2Horizontal: ', ship2Horizontal);

            if (ship.type === ShipType.Horizontal) {
                if (ship.length === 1) imgSourceString = ship1;
                if (ship.length === 2) imgSourceString = ship2Horizontal;
                if (ship.length === 3) imgSourceString = ship3Horizontal;
                if (ship.length === 4) imgSourceString = ship4Horizontal;
            }
            else {
                if (ship.length === 2) imgSourceString = ship2Vertical;
                if (ship.length === 3) imgSourceString = ship3Vertical;
                if (ship.length === 4) imgSourceString = ship4Vertical;

            }

            return imgSourceString;
        },

        // onMouseDownHandler(event: MouseEvent) {
        //     event.preventDefault();
        //     let loc: Location = Location.getLocationByOffsetXY(event.offsetX, event.offsetY, this.getGridCellWidth, this.getGridCellHeight);
        //     console.log('Current location: ', loc);
        //     console.log('selected ship: ', this.getShipByLocation(loc));
        // },

        subscribeToEvents(ctx: CanvasRenderingContext2D) {
            console.log('addEventListener...');
            // ctx.canvas.addEventListener('click', this.onMouseDownHandler);
            ctx.canvas.addEventListener('click', GameEventHandler.onMouseDownHandler);
        },
    },

    mounted() {
        let canvas = <HTMLCanvasElement>this.$refs.canvas;
        let ctx = canvas.getContext("2d");

        if (ctx) {
            ctx.canvas.width = this.getCanvasWidth;
            ctx.canvas.height = this.getCanvasHeight;

            // Рисуем сетку
            this.makeGrid(ctx, store.state.gridLineThickness);

            if (this.gridType === GridType.Own) {
                this.drawShips(ctx);
                this.subscribeToEvents(ctx);
            }
        };

    }
})
</script>


<style lang="css" scoped>
canvas {
    border: 1px dashed rgb(99, 99, 99);
}
</style>