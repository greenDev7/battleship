<template>
  <table id="table">
    <tbody>
      <tr>
        <td colspan="2">
          <p class="fs-6 fw-bold text-nowrap">Введите текст с картинки</p>
        </td>
      </tr>
      <tr>
        <td><canvas id="canvas" ref="canvas"></canvas></td>
        <td>
          <button
            class="btn btn-outline-light w-100 minw"
            type="button"
            @click="generateCapcha"
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
import digits from "@/assets/digits/digits";
import five from "@/assets/digits/5/5.png";
import { CaptchaGenerator } from "captcha-canvas";

export default defineComponent({
  name: "CapchaComponent",

  data() {
    return {
      chars: "abcde",
      numberOfDigits: 4,
      numberOfChars: 2,
    };
  },

  getImage(element: string | Number) {
    if (element instanceof Number) {
      let img = new Image();
      img.src = digits.five.five_0;
      return img;
    }
  },

  methods: {
    async drawCapcha() {
      
      let images = [];

      let img1 = new Image();
      img1.src = digits.five.five_0;
      images.push(img1);

      let img2 = new Image();
      img2.src = digits.nine.nine_1;
      images.push(img2);

      console.log("images: ", digits.five.five_0);

      await Promise.all(
        Array.from(images).map(
          (image) =>
            new Promise((resolve) => image.addEventListener("load", resolve))
        )
      );

      let canvas = <HTMLCanvasElement>this.$refs.canvas;
      const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");

      if (ctx) {

        canvas.width = 150;
        canvas.height = 30;
        // ctx.save();
        ctx.drawImage(
          images[0],
          0,
          0,
          images[0].width,
          images[0].height,
          0,
          0,
          28,
          28
        );

        ctx.drawImage(
          images[1],
          0,
          0,
          images[1].width,
          images[1].height,
          29,
          0,
          28,
          28
        );
        // ctx.restore();
      }
    },
    generateCapcha() {
      let capchaArray = [];

      for (let i = 0; i < this.numberOfDigits; i++)
        capchaArray.push(this.getRandomInt(10));

      let charArray = [];

      for (let i = 0; i < this.chars.length; i++)
        charArray.push(this.chars.charAt(i));

      for (let i = 0; i < this.numberOfChars; i++) {
        const index = this.getRandomInt(this.chars.length);
        capchaArray.push(charArray[index]);
      }

      this.shuffle(capchaArray);

      console.log("capchaArray shuffled:", capchaArray);
    },
    getRandomInt(max: number) {
      const maxFloored = Math.floor(max);
      return Math.floor(Math.random() * maxFloored); // [0, max)
    },
    shuffle(array: (string | number)[]) {
      let currentIndex = array.length;
      // While there remain elements to shuffle...
      while (currentIndex != 0) {
        // Pick a remaining element...
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
          array[randomIndex],
          array[currentIndex],
        ];
      }
    },
  },

  async mounted() {
    await this.drawCapcha();
  },
});
</script>

<style lang="css" scoped>
/* #canvas {
  height: 30px;
  width: 300px;
} */

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