<template>
  <div class="home-page">
    <div class="data-row summary-row">
      <div class="data-block">
        <div class="data-title">
          挣钱<span class="data-sub-title">MONEY</span>
        </div>
        <div class="data-pre-content">今天宁已经挣了</div>
        <div class="data-content">{{ money.toFixed(2) }} 元</div>
        <img src="../../assets/money.svg" class="data-icon" />
      </div>
      <div class="data-block">
        <div class="data-title">
          喝水<span class="data-sub-title">DRINK</span>
        </div>
        <div class="data-content drink-content" @click="onDrinkInc">
          <div class="drink-count">
            {{ todayDrink.count }} / {{ todayDrink.max }}
          </div>

          <div :class="`drink-add-icon ${hasFinished && 'finished-icon'}`">
            <img v-if="hasFinished" src="../../assets/ok-white.svg" />
            <img v-else src="../../assets/add.svg" />
          </div>
        </div>
        <img src="../../assets/drink.svg" class="data-icon" />
      </div>
    </div>

    <div class="data-row shit-row">
      <div class="shit-count">
        <div v-for="(v, i) in myDay" :key="i" class="shit-bar">
          <div class="the-bar">
            <div
              class="the-bar-content"
              :style="`height: ${(v * 100).toFixed(2)}%`"
            />
          </div>
          <div class="bar-title">
            {{ i % 3 === 0 || i === 24 ? i.toString().padStart(2, "0") : "-" }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, onMounted } from "vue";
import { useIpcRenderer } from "../use/electron";
import type { IDrink } from "../use/useDB";
import { useDB } from "../use/useDB";

const TOTAL_MONEY = 1230;
const TOTAL_TIME = 3600 * 9 * 1000;
const TODAY_DATE = new Date();
const TODAY_START =
  +new Date(
    `${TODAY_DATE.getFullYear()}/${
      TODAY_DATE.getMonth() + 1
    }/${TODAY_DATE.getDate()}`
  ) +
  10 * 3600 * 1000;
const MY_DAY = new Array(25).fill(0).map(() => 0.2 + 0.8 * Math.random());

export default defineComponent({
  name: "HelloWorld",
  setup() {
    const db = useDB();
    const ipcRenderer = useIpcRenderer();

    const todayDrink = ref<IDrink>({
      max: 8,
      count: 0,
      timestamp: +db.getToday(),
    });
    const hasFinished = computed(
      () => todayDrink.value.count >= todayDrink.value.max
    );
    const money = ref(0);

    const loadDrink = () => {
      db.getDrink().then((drink) => (todayDrink.value = drink));
    };

    const onDrinkInc = () => {
      if (hasFinished.value) return;
      todayDrink.value.count += 1;

      db.updateDrink(todayDrink.value).then(() => {
        if (hasFinished.value) {
          new Notification("喝水小助手", { body: "恭喜宁喝完辣" }).onclick =
            () => console.log("Notification clicked");
        }
      });
    };

    const registerEvents = () => {
      ipcRenderer.receive("reload", loadDrink);
    };

    const updateMoney = () => {
      setTimeout(() => {
        const now = +new Date();
        const ratio = Math.min(
          1,
          Math.max(0, (now - TODAY_START) / TOTAL_TIME)
        );
        money.value = ratio * TOTAL_MONEY;
        updateMoney();
      }, 500);
    };

    onMounted(() => {
      updateMoney();
      loadDrink();
      registerEvents();
    });

    return {
      todayDrink,
      hasFinished,
      myDay: MY_DAY,
      onDrinkInc,
      money,
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
    padding-left: 12px;
    font-weight: normal;
  }
}

.data-pre-content {
  font-size: 12px;
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
