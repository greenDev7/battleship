<template>
  <p class="text-center fs-5 blink" v-if="isShipPositioningForComputerGame()">
    Расставьте корабли и нажмите "Играть"
  </p>
  <p class="text-center fs-5 blink" v-if="isSearchingForEnemy()">
    Поиск соперника...
  </p>
  <p class="text-center fs-5 blink" v-else-if="isWaitingForEnemyToPlayAgain()">
    Ждем соперника...
  </p>
  <p class="text-center fs-5 blink" v-else-if="isWaitingForFriend()">
    Ждем друга...
  </p>
  <!-- -------------- -->
  <div
    v-else-if="isEnemyPositioningOrArranged()"
    class="card border-success text-center mb-4"
  >
    <div class="card-body text-success">
      <h5 class="card-title">
        Ваш соперник:
        <strong class="darkred">{{ enemyNickName }}</strong>
      </h5>
      <p
        class="card-text text-dark"
        :class="{ blink: isEnemyPositioningOrArranged }"
      >
        {{ getEnemyStateCaption() }}
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
    {{ getEnemyStateCaption() }}
  </p>
</template>


<script lang="ts">
import { defineComponent } from "vue";
import type { PropType } from "vue";
import GameState from "@/model/enums/GameState";
import GameType from "@/model/enums/GameType";

export default defineComponent({
  name: "StateInfoComponent",

  props: {
    enemyNickName: { type: String, default: "" },
    enemyState: {
      type: Number as PropType<GameState>,
      default: GameState.NOT_CREATED,
    },
    myState: {
      type: Number as PropType<GameState>,
      default: GameState.NOT_CREATED,
    },
    gameType: {
      type: Number as PropType<GameType>,
      default: GameType.RANDOM,
    },
  },

  data() {
    return {};
  },

  methods: {
    isShipPositioningForComputerGame(): boolean {
      return (
        this.gameType === GameType.COMPUTER &&
        this.myState === GameState.SHIPS_POSITIONING
      );
    },

    isSearchingForEnemy(): boolean {
      return this.myState === 1;
    },

    isWaitingForEnemyToPlayAgain(): boolean {
      return (
        this.gameType !== GameType.COMPUTER &&
        this.myState === GameState.SHIPS_POSITIONING &&
        this.enemyState === GameState.GAME_IS_OVER
      );
    },

    isWaitingForFriend() {
      return this.myState === GameState.WAITING_FOR_FRIEND;
    },

    isEnemyPositioningOrArranged(): boolean {
      return (
        this.enemyState === GameState.SHIPS_POSITIONING ||
        this.enemyState === GameState.SHIPS_ARE_ARRANGED
      );
    },

    getEnemyStateCaption() {
      switch (this.enemyState) {
        case GameState.SHIPS_POSITIONING:
          return "расставляет корабли...";
        case GameState.SHIPS_ARE_ARRANGED:
          return "расставил корабли и готов играть";
        case GameState.PLAYING:
          return "Игра началась";

        default:
          break;
      }
    },
  },
});
</script>

<style lang="css" scoped>
</style>