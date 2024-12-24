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
          <button class="btn btn-dark w-100 text-nowrap" type="button">
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
  name: "CapchaComponent",

  data() {
    return {
      chars: "abcde",
      numberOfDigits: 4,
      numberOfChars: 2,
    };
  },

  methods: {
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
});
</script>

<style lang="css" scoped>
#canvas {
  height: 28px;
  width: 112px;
}

#img {
  width: 28px;
  height: 28px;
}

#table > tbody > tr > td {
  border: 1px solid;
}

.minw {
  min-width: 7rem;
}
</style>