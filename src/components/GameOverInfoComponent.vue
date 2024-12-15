<template>
  <div
    class="card gold-brd"
    style="max-width: 35rem;"
  >
    <div class="card-header bg-transparent bld larger">
      {{ getCaptions.winnerHeader }}
    </div>
    <div class="card-body">
      <p class="card-text">
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

.gold-brd {
  border: 3px solid rgb(212, 200, 108);
}
</style>