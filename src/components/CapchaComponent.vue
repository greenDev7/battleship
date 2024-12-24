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
          <button class="btn btn-outline-light w-100 minw" type="button">
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
import refresh from "@/assets/refresh-icon.png";

export default defineComponent({
  name: "CapchaComponent",

  data() {
    return {};
  },

  methods: {},
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