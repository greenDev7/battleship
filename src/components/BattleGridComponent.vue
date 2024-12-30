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
      currentTimeStamp: 0,
    };
  },

  computed: {
    ...mapGetters(["getCanvasWidth", "getCanvasHeight"]),
  },

  methods: {
    getContext(): CanvasRenderingContext2D | null {
      let canvas = <HTMLCanvasElement>this.$refs.canvas;
      return canvas.getContext("2d");
    },

    changeShipOrientation(ship: Ship, loc: Location) {
      if (this.crossesBorderWithBackLocation(ship, loc, true)) {
        GameStore.commit("setAlert", {
          alertText:
            "При изменении положения - этот корабль выйдет за границы сетки. Переместите корабль подальше от границы",
          alertColor: "danger",
        });
        return;
      }

      ship.changeOrientation();

      let ctx: CanvasRenderingContext2D | null = this.getContext();

      if (ctx) {
        Game.drawShips(ctx);
        this.checkArrangementAndHighlight(ctx);
      }
    },

    handlePointerDown(event: PointerEvent) {
      event.preventDefault();

      let canvas = <HTMLCanvasElement>this.$refs.canvas;

      let loc: Location = Location.getLocationByOffsetXY(
        event.offsetX,
        event.offsetY
      );

      let ship: Ship | undefined = Game.getShipByHeadLocation(loc);

      if (ship) {
        let timeDelta = Date.now() - this.currentTimeStamp;
        this.currentTimeStamp = Date.now();
        if (timeDelta <= 500) this.changeShipOrientation(ship, loc);

        this.selectedShip = ship;
        canvas.addEventListener("pointermove", this.handlePointerMove);
      }
    },

    handlePointerMove(event: PointerEvent) {
      // получаем текущую локацию
      let loc: Location = Location.getLocationByOffsetXY(
        event.offsetX,
        event.offsetY
      );

      // Если головная локация корабля вышла за рамки грида, то просто выходим из метода
      // и не перемещаем корабль
      if (loc.outsideTheGrid()) return;

      if (this.selectedShip) {
        // Если корабль пересек границу своей конечной локацией (кормой) - тоже выходим из метода
        if (this.crossesBorderWithBackLocation(this.selectedShip as Ship, loc))
          return;

        // Если ни головная, ни конечная локации не вышли за границы сетки,
        // то присваиваем выбранному кораблю новую локацию и далее прорисовываем его
        this.selectedShip.location = loc;
        let ctx: CanvasRenderingContext2D | null = this.getContext();
        if (ctx) Game.drawShips(ctx);
      }
    },

    handlePointerUp(event: PointerEvent) {
      let canvas = <HTMLCanvasElement>this.$refs.canvas;
      let ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");

      canvas.removeEventListener("pointermove", this.handlePointerMove);

      this.selectedShip = null;

      if (ctx) this.checkArrangementAndHighlight(ctx);
    },

    handleTouchStart(event: TouchEvent) {
      event.preventDefault();
    },

    registerOwnGridHandlers(ctx: CanvasRenderingContext2D) {
      ctx.canvas.addEventListener("pointerdown", this.handlePointerDown);
      ctx.canvas.addEventListener("pointermove", this.handlePointerMove);
      ctx.canvas.addEventListener("pointerup", this.handlePointerUp);
      ctx.canvas.addEventListener("touchstart", this.handleTouchStart);

      const pointerDownHandler = this.handlePointerDown;
      const pointerMoveHandler = this.handlePointerMove;
      const pointerUpHandler = this.handlePointerUp;
      const touchStartHandler = this.handleTouchStart;

      GameStore.commit("setHandlers", {
        pointerDownHandler,
        pointerMoveHandler,
        pointerUpHandler,
        touchStartHandler,
      });
    },

    checkArrangementAndHighlight(ctx: CanvasRenderingContext2D): void {
      let res = Game.isArrangementCorrect();
      if (!res[0]) {
        res[1]?.forEach((l) => l.highlight(ctx, HighlightType.SQUARE));
      }
    },

    crossesBorderWithBackLocation(
      selectedShip: Ship,
      currentMovedLocation: Location,
      isDoubleClickEvent: boolean = false
    ): boolean {
      // Создадим временный корабль

      let orientation: ShipOrientation = ShipOrientation.Horizontal;

      if (isDoubleClickEvent) {
        // при проверке на двойной клик - временный корабль нужно создавать
        if (selectedShip.type === ShipOrientation.Horizontal)
          // c ориентацией, противоположной выбранному кораблю
          orientation = ShipOrientation.Vertical;
      } else {
        // иначе - берем такую же, как у выбранного корабля
        orientation = selectedShip.type;
      }

      let tempShip: Ship = new Ship(
        selectedShip.length,
        orientation,
        currentMovedLocation // локацию нужно передавать отдельно, ее нельзя доставать из selectedShip !!!
      );

      // получим конечную локацию этого временного корабля
      let allShipLocs = tempShip.getLocations();
      let endLocation = allShipLocs[allShipLocs.length - 1];

      // возвращаем результат метода outsideTheGrid()
      return endLocation.outsideTheGrid();
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