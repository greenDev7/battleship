<template>
    <div :style="{ height: getCanvasHeight + 'px' }">
        <canvas ref="canvas"></canvas>
    </div>
</template>


<script lang="ts">
import Ship from '@/model/Ship';
import Game from '@/model/Game';
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
import Position from '@/model/Location';
import GridType from '@/model/GridType';

export default defineComponent({

    name: "BattleGridComponent",

    props: {
        gridType: { type: String, default: GridType.Own },
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

                // Расставляем корабли
                this.arrangeShips(ctx);
            };
        },

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

        arrangeShips(ctx: CanvasRenderingContext2D) {

            // Расставляем корабли только на флотильской сетке (GridType.Fleet),
            // с которой игрок будет перетягивать их на свое поле
            if (this.gridType === GridType.Fleet) {
                for (const ship of Game.createInitialShips())
                    this.arrangeSingleShip(ctx, ship);
            }
        },

        arrangeSingleShip(ctx: CanvasRenderingContext2D, ship: Ship) {
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