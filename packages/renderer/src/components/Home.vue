<template>
  <div class="home-page">
    <div class="data-row summary-row">
      <div class="data-block">
        <div class="data-title">
          挣钱<span class="data-sub-title">MONEY</span>
        </div>
        <div class="data-content">¥ 100.04</div>
        <img src="../../assets/money.svg" class="data-icon" />
      </div>
      <div class="data-block">
        <div class="data-title">
          喝水<span class="data-sub-title">DRINK</span>
        </div>
        <div class="data-content drink-content" @click="onDrinkInc">
          <div class="drink-count">{{ drinkCount }} / {{ maxDrinkCount }}</div>

          <div :class="`drink-add-icon ${hasFinised && 'finished-icon'}`">
            <img src="../../assets/ok-white.svg" v-if="hasFinised" />
            <img src="../../assets/add.svg" v-else />
          </div>
        </div>
        <img src="../../assets/drink.svg" class="data-icon" />
      </div>
    </div>

    <div class="data-row shit-row">
      <div class="shit-count">
        <div
          class="shit-bar"
          v-for="(v, i) in new Array(24)
            .fill(0)
            .map(() => 0.2 + 0.8 * Math.random())"
          :key="i"
        >
          <div class="the-bar">
            <div
              class="the-bar-content"
              :style="`height: ${(v * 100).toFixed(2)}%`"
            ></div>
          </div>
          <div class="bar-title">
            {{ i % 4 === 0 ? i.toString().padStart(2, "0") : "-" }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";

const MAX_DRINK_COUNT = 8;

export default defineComponent({
  name: "HelloWorld",
  setup() {
    const drinkCount = ref(1);
    const hasFinised = computed(() => drinkCount.value >= MAX_DRINK_COUNT);

    const onDrinkInc = () => {
      if (drinkCount.value >= MAX_DRINK_COUNT) return;
      drinkCount.value += 1;
    };

    return {
      drinkCount,
      hasFinised,
      maxDrinkCount: MAX_DRINK_COUNT,
      onDrinkInc,
    };
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@border-radius: 10px;
@primary-color: #2c7cf6;

.shadow-block {
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
}

.home-page {
  padding: 10px;
  border: 1px solid rgba(0, 0, 0, 0);
  overflow: hidden;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.data-row {
  display: flex;
  flex: 1;
}

.data-block {
  flex: 1;
  margin-right: 10px;
  border-radius: @border-radius;
  background: rgba(255, 255, 255, 0.3);
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  .shadow-block();
}

.data-block:last-child {
  margin-right: 0;
}

.data-title {
  font-weight: bolder;
  font-size: 12px;

  .data-sub-title {
    padding-left: 10px;
    font-weight: normal;
  }
}

.data-content {
  font-size: 20px;
  font-weight: bolder;
}

.data-icon {
  position: absolute;
  right: 10px;
  bottom: 10px;
  font-size: 50px;
  height: 50px;
  width: 50px;
  opacity: 0.2;
}

.drink-content {
  display: flex;
  align-items: center;

  .drink-add-icon {
    background-color: rgba(0, 0, 0, 0.15);
    width: 18px;
    height: 18px;
    border-radius: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    margin-left: 10px;

    img {
      height: 14px;
      width: 14px;
    }
  }

  .finished-icon {
    background-color: @primary-color;
  }
}

.summary-row {
  margin-bottom: 10px;
}

.shit-count {
  display: flex;
  justify-content: space-between;
  width: 100%;
  background: rgba(255, 255, 255, 0.3);
  border-radius: @border-radius;
  padding: 10px 5px 5px 5px;
  .shadow-block();
}

.shit-bar {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.the-bar {
  height: 100%;
  width: 8px;
  border-radius: 10px;
  box-shadow: 1px 1px 0px rgba(0, 0, 0, 0.1);
  background-color: rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column-reverse;
}

.the-bar-content {
  width: 100%;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.9);
  transition: all ease 0.3s;
}

.bar-title {
  font-size: 10px;
  color: rgba(0, 0, 0, 0.5);
  font-weight: bolder;
  margin-top: 5px;
}
</style>
