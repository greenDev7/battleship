<template>
  <div :style="{ height: getCanvasHeight + 'px' }">
    <canvas ref="canvas"></canvas>
  </div>
</template>


<script lang="ts">
import Ship from "@/model/Ship";
import ShipOrientation from "@/model/ShipOrientation";
import { defineComponent } from "vue";
import { mapGetters } from "vuex";
import GridType from "@/model/GridType";
import Location from "@/model/Location";
import Game from "@/model/Game";

export default defineComponent({
  name: "BattleGridComponent",

  props: {
    gridType: { type: String, default: GridType.Own },
  },

  data() {
    return {
      selectedShip: new Ship(1, ShipOrientation.Horizontal, new Location(0, 0)),
    };
  },

  computed: {
    ...mapGetters(["getCanvasWidth", "getCanvasHeight"]),
  },

  methods: {
    handleMouseDown(event: MouseEvent) {
      event.preventDefault();

      let canvas = <HTMLCanvasElement>this.$refs.canvas;
      canvas.addEventListener("mousemove", this.handleMouseMove);

      let loc: Location = Location.getLocationByOffsetXY(
        event.offsetX,
        event.offsetY
      );
      let ship: Ship | undefined = Game.getShipByLocation(loc);

      if (ship) {
        this.$data.selectedShip = ship;
        console.log("(Mouse Down) Current location: ", loc);
      }
    },

    handleMouseDownHostile(event: MouseEvent) {
      event.preventDefault();

      if (event.button === 0) {
        let loc: Location = Location.getLocationByOffsetXY(
          event.offsetX,
          event.offsetY
        );
        loc.highlight(this.getContext(), GridType.Hostile);
      }
      // console.log('(Mouse Down hostile) Current location: ', loc);
    },

    handleMouseMove(event: MouseEvent) {
      let loc: Location = Location.getLocationByOffsetXY(
        event.offsetX,
        event.offsetY
      );

      if (this.$data.selectedShip) {
        this.$data.selectedShip.location = loc;

        let ctx: CanvasRenderingContext2D | null = this.getContext();

        if (ctx) Game.drawShips(ctx);
      }
    },

    getContext(): CanvasRenderingContext2D | null {
      let canvas = <HTMLCanvasElement>this.$refs.canvas;
      return canvas.getContext("2d");
    },

    handleDoubleClick(event: MouseEvent) {
      let loc: Location = Location.getLocationByOffsetXY(
        event.offsetX,
        event.offsetY
      );
      let ship: Ship | undefined = Game.getShipByLocation(loc);

      if (ship) {
        ship.changeOrientation();

        let ctx: CanvasRenderingContext2D | null = this.getContext();

        if (ctx) {
          Game.drawShips(ctx);
          this.checkArrangementAndHighlight(ctx);
        }
      }
    },

    handleMouseUp(event: MouseEvent) {
      console.log("(Mouse Up)");
      let canvas = <HTMLCanvasElement>this.$refs.canvas;
      let ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");
      canvas.removeEventListener("mousemove", this.handleMouseMove);

      if (ctx) this.checkArrangementAndHighlight(ctx);
    },

    checkArrangementAndHighlight(ctx: CanvasRenderingContext2D): void {
      let res = Game.isArrangementCorrect(Game.ships);
      if (!res[0]) {
        res[1]?.forEach((l) => l.highlight(ctx));
      }
    },

    registerOwnGridHandlers(ctx: CanvasRenderingContext2D) {
      console.log("addEventListeners for own grid...");
      ctx.canvas.addEventListener("mousedown", this.handleMouseDown);
      ctx.canvas.addEventListener("mouseup", this.handleMouseUp);
      ctx.canvas.addEventListener("dblclick", this.handleDoubleClick);
    },

    registerHostileGridHandlers(ctx: CanvasRenderingContext2D) {
      console.log("addEventListeners for hostile grid...");
      ctx.canvas.addEventListener("mousedown", this.handleMouseDownHostile);
    },
  },

  mounted() {
    let ctx: CanvasRenderingContext2D | null = this.getContext();

    if (ctx) {
      ctx.canvas.width = this.getCanvasWidth;
      ctx.canvas.height = this.getCanvasHeight;

      Game.makeGrid(ctx);

      if (this.gridType === GridType.Own) {
        Game.ships.forEach((ship) => ship.draw(ctx));
        this.registerOwnGridHandlers(ctx);
      } else {
        this.registerHostileGridHandlers(ctx);
      }
    }
  },
});
</script>


<style lang="css" scoped>
canvas {
  border: 1px dashed rgb(99, 99, 99);
}
</style>