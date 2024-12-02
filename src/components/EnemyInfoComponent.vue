<template>
  <div class="larger" v-if="this.enemyState === 1">
    {{ getEnemyStateCaption() }}
  </div>
  <div v-else-if="this.enemyState === 2 || this.enemyState === 3">
    <span class="larger">Ваш противник: </span>
    <span class="darkred larger">{{ enemyNickName }}</span>
    <p class="small">{{ getEnemyStateCaption() }}</p>
    <hr />
    <div class="green" v-if="enemyNickName">
      Расставьте корабли и нажмите кнопку "Играть"
    </div>
  </div>
  <div v-else>
    <span class="larger">{{ getEnemyStateCaption() }}</span>
  </div>
</template>


<script lang="ts">
import { defineComponent } from "vue";
import type { PropType } from "vue";
import EnemyState from "@/model/EnemyState";

export default defineComponent({
  name: "InfoBoardComponent",

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