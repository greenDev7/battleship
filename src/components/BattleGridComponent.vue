<template>
  <div :style="{ height: getCanvasHeight + 'px' }">
    <canvas ref="canvas"></canvas>
  </div>
</template>


<script lang="ts">
import Ship from "@/model/Ship";
import ShipOrientation from "@/model/enums/ShipOrientation";
import { defineComponent } from "vue";
import { mapGetters } from "vuex";
import GridType from "@/model/enums/GridType";
import Location from "@/model/Location";
import Game from "@/model/Game";
import GameStore from "@/store/index";
import HighlightType from "@/model/enums/HighlightType";

export default defineComponent({
  name: "BattleGridComponent",

  props: {
    gridType: { type: String, default: GridType.Own },
  },

  data() {
    return {
      selectedShip: <Ship | null>(
        new Ship(1, ShipOrientation.Horizontal, new Location(0, 0))
      ),
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

      let ship: Ship | undefined = Game.getShipByHeadLocation(loc);

      if (ship) {
        this.selectedShip = ship;
        console.log("(Mouse Down) Current location: ", loc);
      }
    },

    handleMouseMove(event: MouseEvent) {
      let loc: Location = Location.getLocationByOffsetXY(
        event.offsetX,
        event.offsetY
      );

      if (this.selectedShip) {
        this.selectedShip.location = loc;

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
      let ship: Ship | undefined = Game.getShipByHeadLocation(loc);

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

      this.selectedShip = null;

      if (ctx) this.checkArrangementAndHighlight(ctx);
    },

    checkArrangementAndHighlight(ctx: CanvasRenderingContext2D): void {
      let res = Game.isArrangementCorrect();
      if (!res[0]) {
        res[1]?.forEach((l) => l.highlight(ctx, HighlightType.SQUARE));
      }
    },

    registerOwnGridHandlers(ctx: CanvasRenderingContext2D) {
      ctx.canvas.addEventListener("mousedown", this.handleMouseDown);
      ctx.canvas.addEventListener("mouseup", this.handleMouseUp);
      ctx.canvas.addEventListener("dblclick", this.handleDoubleClick);

      const mouseDownHandler = this.handleMouseDown;
      const mouseUpHandler = this.handleMouseUp;
      const doubleClickHandler = this.handleDoubleClick;

      GameStore.commit("setHandlers", {
        mouseDownHandler,
        mouseUpHandler,
        doubleClickHandler,
      });
    },
  },

  mounted() {
    let ctx: CanvasRenderingContext2D | null = this.getContext();

    if (ctx) {
      ctx.canvas.width = this.getCanvasWidth;
      ctx.canvas.height = this.getCanvasHeight;

      Game.makeGrid(ctx);

      if (this.gridType === GridType.Own) {
        Game.ships.forEach((ship) => {
          ship.draw(ctx);
        });
        this.registerOwnGridHandlers(ctx);
        // сохраняем ctx в глобальном Store для использования в родительских компонентах
        GameStore.commit("setContext2D", ctx);
      } else {
        GameStore.commit("setContextHostile2D", ctx);
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