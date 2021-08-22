<template>
  <div>this is about page</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useElectron } from "/@/use/electron";
export default defineComponent({
  name: "App",
  setup() {
    const { versions } = useElectron();
    // It makes no sense to make "versions" reactive
    return { versions };
  },
});
</script>

<style scoped>
div {
  text-align: left;
  display: grid;
  justify-content: center;
}
</style>
