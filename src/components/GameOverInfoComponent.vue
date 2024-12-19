<template>
  <div
    class="card text-center mb-4"
    :class="[isWinner ? 'gold' : 'text-white bg-secondary grey-border']"
  >
    <div class="card-header bg-transparent fs-4">
      {{ isWinner ? getCaptions.winnerHeader : getCaptions.loserHeader }}
    </div>
    <div class="card-body">
      <p class="card-text fw-bold">
        {{ isWinner ? getCaptions.winnerText : getCaptions.loserText }}
      </p>
    </div>
  </div>
</template>


<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters } from "vuex";

export default defineComponent({
  name: "GameOverInfoComponent",

  props: {
    isWinner: { type: Boolean, default: false },
  },

  data() {
    return {};
  },

  computed: { ...mapGetters(["getCaptions"]) },

  methods: {},
});
</script>

<style lang="css" scoped>
.gold {
  border: 3px solid rgb(128, 115, 66);
  background-color: rgb(212, 200, 108);
}

.grey-border {
  border: 3px solid rgb(82, 88, 94);
}
</style>