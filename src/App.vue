<template>
  <nav class="navbar navbar-expand navbar-dark bg-dark mb-5">
    <div class="navbar-nav container">
      <router-link class="nav-item nav-link" to="/battle"
        >Морской бой</router-link
      >
      <router-link class="nav-item nav-link" to="/about"
        >Статистика</router-link
      >
      <router-link class="nav-item nav-link" to="/">Помощь проекту</router-link>
    </div>
  </nav>
  <router-view />
</template>


<style>
#app {
  box-sizing: border-box;
}

.blink {
  animation: blink-animation 2s steps(5, start) infinite;
  -webkit-animation: blink-animation 2s steps(5, start) infinite;
}

.darkred {
  color: rgb(146, 42, 38);
}

.green {
  color: rgb(66, 185, 131);
}

@keyframes blink-animation {
  to {
    visibility: hidden;
  }
}

@-webkit-keyframes blink-animation {
  to {
    visibility: hidden;
  }
}
</style>
