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
            @click="refreshCaptcha"
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
            v-model="userText"
          />
        </td>
        <td>
          <button
            class="btn btn-dark w-100"
            type="button"
            @click="$emit('captchaOkButtonClicked', getComparisonResult())"
          >
            OK
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>


<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "CaptchaComponent",

  emits: {
    captchaOkButtonClicked(payload: boolean) {
      // return `true` or `false` to indicate
      // validation pass / fail
      return true;
    },
  },

  data() {
    return {
      chars:
        "A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,0,1,2,3,4,5,6,7,8,9,$,%,&",
      numberOfCharsForCaptcha: 4,
      canvasWidth: 150,
      canvasHeight: 40,
      captchaLetters: [] as string[],
      userText: "",
    };
  },

  methods: {
    getComparisonResult(): boolean {
      return this.captchaLetters.join("") === this.userText.toUpperCase();
    },

    async refreshCaptcha() {
      let canvas = <HTMLCanvasElement>this.$refs.canvas;
      const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");

      if (ctx) {
        canvas.width = this.canvasWidth;
        canvas.height = this.canvasHeight;

        ctx.save();

        ctx.font = "bold 25px serif";
        ctx.textBaseline = "top";
        ctx.textAlign = "left";

        this.captchaLetters = this.generateCodeArray();

        for (let i = 0; i < this.captchaLetters.length; i++) {
          let angle = (Math.random() * Math.PI) / 10;
          let x = i * 10 + 10;
          let y = Math.random() * 4;

          ctx.translate(x, y);
          ctx.rotate(angle);
          ctx.fillStyle = this.getRandomColor();

          ctx.fillText(this.captchaLetters[i], 0, 0);

          ctx.rotate(-angle);
        }

        ctx.restore();

        this.addLine(ctx);
      }
    },

    addLine(ctx: CanvasRenderingContext2D) {
      ctx.strokeStyle = this.getRandomColor();
      ctx.beginPath();
      ctx.moveTo(0, this.canvasHeight / 2);
      ctx.lineTo(this.canvasWidth - 30, this.canvasHeight / 2);
      ctx.stroke();
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

    getRandomColor() {
      let r = this.getRandomInt(256);
      let g = this.getRandomInt(256);
      let b = this.getRandomInt(256);
      return "rgb(" + r + "," + g + "," + b + ")";
    },
  },

  async mounted() {
    await this.refreshCaptcha();
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