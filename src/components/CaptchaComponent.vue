<template>
  <table id="table">
    <tbody>
      <tr>
        <td colspan="2">
          <p class="fs-6 fw-bold text-nowrap">Введите текст с картинки</p>
        </td>
      </tr>
      <tr>
        <td>
          <div class="text-center">
            <canvas id="canvas" ref="canvas"></canvas>
          </div>
        </td>
        <td>
          <button
            class="btn btn-outline-light w-100 minw"
            type="button"
            @click="drawCaptcha"
          >
            <img id="img" src="@/assets/refresh-icon.png" alt="refresh" />
          </button>
        </td>
      </tr>
      <tr>
        <td>
          <input
            class="form-control"
            placeholder="Текст с картинки"
            type="text"
          />
        </td>
        <td>
          <button class="btn btn-dark w-100" type="button">OK</button>
        </td>
      </tr>
    </tbody>
  </table>
</template>


<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "CaptchaComponent",

  data() {
    return {
      chars:
        "A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,0,1,2,3,4,5,6,7,8,9,$,%,&",
      numberOfCharsForCaptcha: 4,
    };
  },

  methods: {
    async drawCaptcha() {
      let canvas = <HTMLCanvasElement>this.$refs.canvas;
      const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");

      if (ctx) {
        canvas.width = 150;
        canvas.height = 40;

        ctx.font = "25px serif";
        ctx.textBaseline = "top";
        ctx.textAlign = "left";
        ctx.fillStyle = "black";

        let codes: string[] = this.generateCodeArray();
        for (let i = 0; i < codes.length; i++) {
          let angle = (Math.random() * Math.PI) / 10;
          let x = i * 10 + 10;
          let y = Math.random() * 4;

          ctx.translate(x, y);
          ctx.rotate(angle);

          ctx.fillText(codes[i], 0, 0);

          ctx.rotate(-angle);
        }
      }
    },

    generateCodeArray(): string[] {
      let charArray: string[] = this.chars.split(",");

      let codeArray: string[] = [];
      for (let i = 0; i < this.numberOfCharsForCaptcha; i++) {
        const randomIndex = this.getRandomInt(charArray.length);
        codeArray.push(charArray[randomIndex]);
      }

      return codeArray;
    },
    getRandomInt(max: number) {
      return Math.floor(Math.random() * max); // [0, max)
    },
  },

  async mounted() {
    let codes = this.generateCodeArray();
    await this.drawCaptcha();
    console.log("code array: ", codes);
  },
});
</script>

<style lang="css" scoped>
#img {
  width: 30px;
  height: 30px;
}

#table > tbody > tr > td {
  border: 1px solid;
}

.minw {
  min-width: 7rem;
}
</style>