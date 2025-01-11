<template>
  <div>
    <table>
      <tbody>
        <tr>
          <td>1</td>
          <td>2</td>
        </tr>
        <tr>
          <td>3</td>
          <td>4</td>
        </tr>
        <tr>
          <td>5</td>
          <td>6</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>


<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "StatisticsInfoComponent",

  props: {
    rowCount: { type: Number, default: 10 },
    dataRows: { type: Object, default: null },
  },

  data() {
    return {};
  },

  methods: {},
});
</script>

<style lang="css" scoped>
</style>