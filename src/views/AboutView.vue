<template>
  <div class="container text-center">
    <h1>Привет, игрок!</h1>
    <br />
    <p>
      Любые замечания, вопросы и предложения по игре можешь направлять на
      <a href="https://simplegames2025@gmail.com">simplegames2025@gmail.com</a>
    </p>

    <StatisticsInfoComponent />
  </div>
</template>


<script lang="ts">
import { defineComponent } from "vue";
import StatisticsInfoComponent from "@/components/StatisticsInfoComponent.vue";

export default defineComponent({
  components: {
    StatisticsInfoComponent,
  },

  data() {
    return {
      
    };
  },
  async mounted() {},
});
</script>