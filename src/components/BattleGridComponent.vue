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
import shipBackgroundHorizontal from "../assets/shipBackgroundHorizontal.png";
import shipBackgroundVertical from "../assets/shipBackgroundVertical.png";

import { defineComponent, PropType } from 'vue'
import { mapGetters } from 'vuex';
import GameStore from '@/store/modules/GameStore';
import GridType from '@/model/GridType';
import Location from '@/model/Location';

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
            let sp = GameStore.state.scaleParameter;
            GameStore.state.ships.forEach(ship => ship.draw(ctx, this.getGridCellWidth, this.getGridCellHeight, sp));
        },       

        onMouseDownEventHandler(event: MouseEvent, ctx: CanvasRenderingContext2D) {
            event.preventDefault();
            let loc: Location = Location.getLocationByOffsetXY(event.offsetX, event.offsetY, this.getGridCellWidth, this.getGridCellHeight);
            let selectedShip = this.getShipByLocation(loc);

            // if (selectedShip) { this.highlightShipStructure(ctx, selectedShip); }
            console.log('(Mouse Down) Current location: ', loc);
            console.log('(Mouse Down) Selected ship: ', selectedShip);
        },

        onMouseMoveEventHandler(event: MouseEvent, ctx: CanvasRenderingContext2D) {
            // console.log('(Mouse Move) Current coordinates: ', event.offsetX, event.offsetY);
            // let loc: Location = Location.getLocationByOffsetXY(event.offsetX, event.offsetY, this.getGridCellWidth, this.getGridCellHeight);
            // console.log('(Mouse Move) Current location: ', loc);
        },

        onMouseUpEventHandler(event: MouseEvent) {
            let loc: Location = Location.getLocationByOffsetXY(event.offsetX, event.offsetY, this.getGridCellWidth, this.getGridCellHeight);
            console.log('(Mouse Up) Current location: ', loc);
        },

        subscribeToEvents(ctx: CanvasRenderingContext2D) {
            console.log('addEventListeners...');
            ctx.canvas.addEventListener('mousedown', (event) => this.onMouseDownEventHandler(event, ctx));
            ctx.canvas.addEventListener('mousemove', (event) => this.onMouseMoveEventHandler(event, ctx));
            ctx.canvas.addEventListener('mouseup', this.onMouseUpEventHandler);
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