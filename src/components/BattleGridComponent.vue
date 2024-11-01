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
            for (const ship of GameStore.state.ships)
                this.drawSingleShip(ctx, ship);
        },

        drawSingleShip(ctx: CanvasRenderingContext2D, ship: Ship) {
            let img = new Image();

            if (!img.src) {
                img.src = this.determineShipImage(ship);
                const sp = GameStore.state.scaleParameter;
                img.onload = () => {
                    ctx.drawImage(img, ship.location.x * this.getGridCellWidth,
                        ship.location.y * this.getGridCellHeight, img.width * sp, img.height * sp);
                };
            }
        },

        determineShipImage(ship: Ship): string {
            let imgSourceString: string = "";

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

        highlightShipStructure(ctx: CanvasRenderingContext2D, selectedShip: Ship) {
            let img = new Image();

            if (!img.src) {
                let sx = 0, sy = 0;
                let sw: number = 0, sh: number = 0, dw: number, dh: number;

                let dx = selectedShip.location.x * this.getGridCellWidth;
                let dy = selectedShip.location.y * this.getGridCellHeight;

                if (selectedShip.type === ShipType.Horizontal) {
                    sw = selectedShip.length * this.getGridCellWidth;
                    sh = this.getGridCellHeight;
                    img.src = shipBackgroundHorizontal;
                };

                if (selectedShip.type === ShipType.Vertical) {
                    sw = this.getGridCellWidth;
                    console.log('sw: ', sw);
                    sh = selectedShip.length * this.getGridCellHeight;
                    img.src = shipBackgroundVertical;
                };

                dw = sw;

                console.log('dw: ', dw);
                dh = sh;

                img.onload = () => {
                    ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
                };
            }
        },

        onMouseDownEventHandler(event: MouseEvent, ctx: CanvasRenderingContext2D) {
            event.preventDefault();
            let loc: Location = Location.getLocationByOffsetXY(event.offsetX, event.offsetY, this.getGridCellWidth, this.getGridCellHeight);
            let selectedShip = this.getShipByLocation(loc);

            if (selectedShip) { this.highlightShipStructure(ctx, selectedShip); }
            console.log('(Mouse Down) Current location: ', loc);
            console.log('(Mouse Down) Selected ship: ', selectedShip);
        },

        onMouseMoveEventHandler(event: MouseEvent) {
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
            ctx.canvas.addEventListener('mousemove', this.onMouseMoveEventHandler);
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