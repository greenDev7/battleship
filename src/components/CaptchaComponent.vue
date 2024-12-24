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

export default defineComponent({
  name: "CaptchaComponent",

  data() {
    return {
      chars:
        "A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,0,1,2,3,4,5,6,7,8,9,!,@,#,$,%,^,&,*,(,)",
      numberOfDigits: 4,
      numberOfChars: 2,
    };
  },

  methods: {
    async drawCapcha() {
      let canvas = <HTMLCanvasElement>this.$refs.canvas;
      const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");

      if (ctx) {
        canvas.width = 150;
        canvas.height = 30;
      }
    },
    generateCapcha() {},
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