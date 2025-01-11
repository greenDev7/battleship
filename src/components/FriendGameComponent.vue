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
              placeholder="Введи id друга и нажми создать игру"
              @input="$emit('friendUUIDUpdated', $event.target.value)"
              :disabled="friendInputDisabled"
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

  emits: {
    friendUUIDUpdated(payload: string) {
      // return `true` or `false` to indicate
      // validation pass / fail
      return true;
    },
  },

  props: {
    clientUUID: { type: String, default: "" },
    friendInputDisabled: { type: Boolean, default: false },
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