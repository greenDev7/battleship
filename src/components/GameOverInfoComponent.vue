<template>
  <div class="card gold text-center mb-4">
    <div class="card-header bg-transparent larger fs-4">
      {{ getCaptions.winnerHeader }}
    </div>
    <div class="card-body">
      <p class="card-text fw-bold">
        {{ getCaptions.winnerText }}
      </p>
    </div>
  </div>
</template>


<script lang="ts">
import { defineComponent } from "vue";
import "bootstrap/dist/css/bootstrap.min.css";
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

.mw {
  max-width: 35rem;
}
</style>