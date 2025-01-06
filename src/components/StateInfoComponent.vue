<template>
  <p class="text-center fs-5 blink" v-if="this.enemyState === 1">
    {{ getGameStateCaption() }}
  </p>
  <!-- -------------- -->
  <div
    v-else-if="isGameStateBeforePlaying()"
    class="card border-success text-center mb-4"
  >
    <div class="card-body text-success">
      <h5 class="card-title">
        Ваш соперник:
        <strong class="darkred">{{ enemyNickName }}</strong>
      </h5>
      <p
        class="card-text text-dark"
        :class="{ blink: isGameStateBeforePlaying }"
      >
        {{ getGameStateCaption() }}
      </p>
    </div>
    <div
      v-if="enemyNickName"
      class="card-footer bg-transparent border-success text-success"
    >
      Расставьте корабли и нажмите кнопку "Играть"
    </div>
  </div>
  <!-- -------------- -->
  <p v-else class="text-center mb-lg-4 mb-5">
    {{ getGameStateCaption() }}
  </p>
</template>


<script lang="ts">
import { defineComponent } from "vue";
import type { PropType } from "vue";
import GameState from "@/model/enums/GameState";

export default defineComponent({
  name: "StateInfoComponent",

  props: {
    enemyNickName: { type: String, default: "" },
    enemyState: {
      type: Number as PropType<GameState>,
      default: GameState.NOT_CREATED,
    },
  },

  data() {
    return {};
  },

  methods: {
    isGameStateBeforePlaying(): boolean {
      return this.enemyState === 2 || this.enemyState === 3;
    },

    getGameStateCaption(): string {
      switch (this.enemyState) {
        case GameState.SHIPS_POSITIONING:
          return "расставляет корабли...";
        case GameState.READY_TO_PLAY:
          return "расставил корабли и готов играть";
        case GameState.PLAYING:
          return "Игра началась";

        default:
          return "Ожидание противника...";
      }
    },
  },
});
</script>

<style lang="css" scoped>
</style>