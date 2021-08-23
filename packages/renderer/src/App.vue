<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import AppNavigation from "/@/components/AppNavigation.vue";
export default defineComponent({
  name: "App",
  components: {
    AppNavigation,
  },
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
}

body {
  margin: 0;
  padding: 0;
}

* {
  box-sizing: border-box;
  user-select: none;
}
</style>
