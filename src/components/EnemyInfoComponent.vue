<template>
  <p class="text-center fs-5 blink" v-if="this.enemyState === 1">
    {{ getEnemyStateCaption() }}
  </p>
  <!-- -------------- -->
  <div
    v-else-if="isEnemyStateBeforePlaying()"
    class="card border-success text-center mb-4"
  >
    <div class="card-body text-success">
      <h5 class="card-title">
        Ваш соперник:
        <strong class="darkred">{{ enemyNickName }}</strong>
      </h5>
      <p
        class="card-text text-dark"
        :class="{ blink: isEnemyStateBeforePlaying }"
      >
        {{ getEnemyStateCaption() }}
      </p>
    </div>
    <div
      v-if="enemyNickName"
      class="card-footer bg-transparent border-success text-success larger bld"
    >
      Расставьте корабли и нажмите кнопку "Играть"
    </div>
  </div>
  <!-- -------------- -->
  <p v-else class="larger text-center mb-4">
    {{ getEnemyStateCaption() }}
  </p>
</template>


<script lang="ts">
import { defineComponent } from "vue";
import type { PropType } from "vue";
import EnemyState from "@/model/enums/EnemyState";
import "bootstrap/dist/css/bootstrap.min.css";

export default defineComponent({
  name: "EnemyInfoComponent",

  props: {
    enemyNickName: { type: String, default: "" },
    enemyState: {
      type: Number as PropType<EnemyState>,
      default: EnemyState.WAITING_FOR_ENEMY,
    },
  },

  data() {
    return {};
  },

  methods: {
    isEnemyStateBeforePlaying(): boolean {
      return this.enemyState === 2 || this.enemyState === 3;
    },

    getEnemyStateCaption(): string {
      switch (this.enemyState) {
        case EnemyState.SHIPS_POSITIONING:
          return "расставляет корабли...";
        case EnemyState.READY_TO_PLAY:
          return "расставил корабли и готов играть";
        case EnemyState.PLAYING:
          return "Игра началась";

        default:
          return "Ожидание противника...";
      }
    },
  },
});
</script>

<style lang="css" scoped>
.darkred {
  color: rgb(146, 42, 38);
}
</style>