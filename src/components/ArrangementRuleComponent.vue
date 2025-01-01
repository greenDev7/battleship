<template>
  <div class="container">
    <div class="d-flex flex-row flex-wrap justify-content-center">
      <div class="p-3">
        <div class="badge text-bg-dark text-wrap p-3 fs-6 minmaxw custom-style">
          <p>Перемещай корабли используя первую клетку корабля.</p>
          <p>Двойной клик по ней меняет положение корабля</p>
        </div>
      </div>
      <div>
        <img src="@/assets/arrang_rule.png" alt="arrang_rule" />
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "ArrangementRuleComponent",
});
</script>

<style lang="css" scoped>
.minmaxw {
  max-width: 20rem;
}

.custom-style {
  height: 100%;
  align-content: center;
}
</style>