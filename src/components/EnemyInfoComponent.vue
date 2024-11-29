<template>
  <div>
    <div class="larger" v-if="!this.enemyState">Ожидание противника...</div>
    <div v-else>
      <span class="larger">Ваш противник: </span>
      <span class="darkred larger">{{ enemyNickName }}</span>
      <p class="small">{{ enemyState }}</p>
      <hr />
    </div>
    <div class="green" v-if="enemyNickName">
      Расставьте корабли и нажмите кнопку "Играть"
    </div>
  </div>
</template>


<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters } from "vuex";

export default defineComponent({
  name: "InfoBoardComponent",

  props: {
    enemyNickName: { type: String, default: "" },
    enemyState: { type: String, default: "" },
  },

  data() {
    return {};
  },

  methods: {},
});
</script>

<style lang="css" scoped>
.green {
  color: rgb(66, 185, 131);
  font-weight: bold;
}

.darkred {
  color: rgb(146, 42, 38);
  font-weight: bold;
}

.small {
  font-size: small;
}

.larger {
  font-size: larger;
}
</style>