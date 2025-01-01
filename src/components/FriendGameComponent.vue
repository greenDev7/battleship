<template>
  <div class="container text-center pt-2 pb-2">
    <table class="custom-min-width">
      <tbody>
        <tr class="text-nowrap">
          <td>Ваш id (отправь другу)</td>
        </tr>
        <tr>
          <td>
            <input
              class="form-control"
              type="text"
              disabled
              :value="clientUUID"
            />
          </td>
        </tr>
        <tr>
          <td>
            <input
              class="form-control"
              type="text"
              placeholder="Введите id друга"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>


<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "FriendGameComponent",

  props: {
    clientUUID: { type: String, default: "" },
  },
});
</script>

<style lang="css" scoped>
.custom-min-width {
  min-width: 21rem;
}

table > tbody > tr > td {
  padding-bottom: 10px;
}
</style>