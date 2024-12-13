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

      let loc: Location = Location.getLocationByOffsetXY(
        event.offsetX,
        event.offsetY
      );

      let ship: Ship | undefined = Game.getShipByHeadLocation(loc);

      if (ship) {
        this.selectedShip = ship;
        canvas.addEventListener("mousemove", this.handleMouseMove);
      }
    },

    handleMouseMove(event: MouseEvent) {
      let loc: Location = Location.getLocationByOffsetXY(
        event.offsetX,
        event.offsetY
      );

      // Если головная локация корабля вышла за рамки грида, то просто выходим из метода
      // и не перемещаем корабль
      if (loc.outsideTheGrid()) return;

      if (this.selectedShip) {
        // Теперь проверим, что конечная локация выбранного корабля также не выходит за границы грида.
        // Делать это нужно с помощью временного корабля, чтобы не трогать this.selectedShip

        // Создадим временный корабль
        let tempShip: Ship = new Ship(
          this.selectedShip.length,
          this.selectedShip.type,
          loc /* в качетсве локации передаем текущую */
        );
        // получим конечную локацию этого временного корабля
        let allShipLocs = tempShip.getLocations();
        let endLocation = allShipLocs[allShipLocs.length - 1];
        // если конечная локация временного корабля вышла за границы сетки - выходим из метода
        if (endLocation.outsideTheGrid()) return;

        // Если ни головная, ни конечная локации не вышли за границы сетки,
        // то присваиваем выбранному кораблю новую локацию и далее прорисовываем его
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
      let canvas = <HTMLCanvasElement>this.$refs.canvas;
      let ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");
      canvas.removeEventListener("mousemove", this.handleMouseMove);

      this.selectedShip = null;

      if (ctx) this.checkArrangementAndHighlight(ctx);
      console.log("ships:", Game.ships);
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