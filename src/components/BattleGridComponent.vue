<template>
    <canvas ref="canvas"></canvas>
</template>


<script lang="ts">

import Ship from '@/model/Ship';
import ShipType from '@/model/ShipType';
import store from '@/store/modules/GameStore';


import { defineComponent } from 'vue'
import { mapGetters } from 'vuex';
import GameStore from '@/store/modules/GameStore';
import GridType from '@/model/GridType';
import Location from '@/model/Location';
import Game from '@/model/Game';

export default defineComponent({

    name: "BattleGridComponent",

    props: {
        gridType: { type: String, default: GridType.Own },
    },

    data() {
        return {
            selectedShip: new Ship(1, ShipType.Horizontal, new Location(0, 0))
        }
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
            ctx.save();
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
            ctx.restore();
        },

        drawShips(ctx: CanvasRenderingContext2D) {
            ctx.save();
            ctx.clearRect(0, 0, this.getCanvasWidth, this.getCanvasHeight);
            this.makeGrid(ctx, store.state.gridLineThickness);
            GameStore.state.ships.forEach(ship => ship.draw(ctx, this.getGridCellWidth, this.getGridCellHeight));
            ctx.restore();
        },

        onMouseDownEventHandler(event: MouseEvent) {
            let canvas = <HTMLCanvasElement>this.$refs.canvas;
            canvas.addEventListener('mousemove', this.onMouseMoveEventHandler);

            let loc: Location = Location.getLocationByOffsetXY(event.offsetX, event.offsetY, this.getGridCellWidth, this.getGridCellHeight);
            this.$data.selectedShip = this.getShipByLocation(loc);

            if (this.$data.selectedShip) {
                console.log('(Mouse Down) Current location: ', loc);
                console.log('(Mouse Down) Selected ship: ', this.$data.selectedShip);
                // console.log('(Mouse Down) Locations: ', this.$data.selectedShip.getLocations());
            }
        },

        onMouseMoveEventHandler(event: MouseEvent) {
            let loc: Location = Location.getLocationByOffsetXY(event.offsetX, event.offsetY, this.getGridCellWidth, this.getGridCellHeight);

            // console.log('mouse move:', event.offsetX, event.offsetY);
            console.log('mouse move (Location):', loc.x, loc.y);

            if (this.$data.selectedShip) {
                this.$data.selectedShip.location = loc;

                let canvas = <HTMLCanvasElement>this.$refs.canvas;
                let ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");

                if (ctx)
                    this.drawShips(ctx);
            }
        },

        onDblClickEventHandler(event: MouseEvent) {
            let loc: Location = Location.getLocationByOffsetXY(event.offsetX, event.offsetY, this.getGridCellWidth, this.getGridCellHeight);

            if (this.$data.selectedShip) {
                this.$data.selectedShip.changeShipType();

                let canvas = <HTMLCanvasElement>this.$refs.canvas;
                let ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");

                if (ctx)
                    this.drawShips(ctx);
            }

            console.log('(Mouse DblClick) Current location: ', loc);
        },

        onMouseUpEventHandler(event: MouseEvent) {
            console.log('(Mouse Up)');
            let canvas = <HTMLCanvasElement>this.$refs.canvas;
            let ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");
            canvas.removeEventListener('mousemove', this.onMouseMoveEventHandler);

            let res = Game.isArrangementCorrect(GameStore.state.ships);
            console.log('Arrangement is correct:', Game.isArrangementCorrect(GameStore.state.ships));

            if (!res[0]) {
                res[1]?.forEach(l => l.highlight(ctx, this.getGridCellWidth, this.getGridCellHeight));
            }
        },

        subscribeToEvents(ctx: CanvasRenderingContext2D) {
            console.log('addEventListeners...');
            ctx.canvas.addEventListener('mousedown', this.onMouseDownEventHandler);
            // ctx.canvas.addEventListener('mousemove', this.onMouseMoveEventHandler);
            ctx.canvas.addEventListener('mouseup', this.onMouseUpEventHandler);
            ctx.canvas.addEventListener('dblclick', this.onDblClickEventHandler);
        },
    },

    mounted() {
        let canvas = <HTMLCanvasElement>this.$refs.canvas;
        let ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");

        if (ctx) {
            ctx.canvas.width = this.getCanvasWidth;
            ctx.canvas.height = this.getCanvasHeight;

            this.makeGrid(ctx, store.state.gridLineThickness);

            if (this.gridType === GridType.Own) {
                GameStore.state.ships.forEach(ship => ship.draw(ctx, this.getGridCellWidth, this.getGridCellHeight));
                this.subscribeToEvents(ctx);
            }
        };
    }
})
</script>


<style lang="css" scoped>
canvas {
    border: 1px dashed rgb(99, 99, 99);
    width: 100%;
    height: 100%;
}
</style>