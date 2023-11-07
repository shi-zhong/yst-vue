<script setup lang="ts">
import { Button, Icon } from '@/components';
// import { useCharacterStateStore } from '@/stores/Character';
import { watch, ref } from 'vue';
import LifeMax from '@/assets/icons/lifeMax.png';
import Attack from '@/assets/icons/attack.png';
import Defence from '@/assets/icons/defence.png';
import EMaster from '@/assets/icons/elementMaster.png';
import { ArtifactDescribe } from '@/components/Artifact';

import { Sound } from '@/utils/sound';

const buttonSelect = ref(false);

const detailVisible = ref(false);
// const store = useCharacterStateStore();

watch(
  () => store.sidebar.state,
  () => {
    if (store.sidebar.state !== 'folding') {
      buttonSelect.value = false;
    }
  }
);

const datas = [
  {
    text: '生命值上限',
    value: '15961'
  },
  {
    text: '攻击力',
    value: '1384'
  },
  {
    text: '防御力',
    value: '678'
  },
  {
    text: '元素精通',
    value: '953'
  }
];

const icons = [LifeMax, Attack, Defence, EMaster];

const data = {
  basic: [
    {
      basic: 9450,
      extra: 0
    },
    {
      basic: 979,
      extra: 0
    },
    {
      basic: 564,
      extra: 0
    },
    {
      basic: 219,
      extra: 0
    },
    {
      basic: 240,
      extra: 0
    }
  ],
  more: [57.2, 146, 4, 0, 0, 125.9, 5, 0],
  element: [
    { basic: 12, extra: 0 },
    { basic: 12, extra: 0 },
    { basic: 12, extra: 0 },
    { basic: 12, extra: 0 },
    { basic: 12, extra: 0 },
    { basic: 12, extra: 0 },
    { basic: 12, extra: 0 },
    { basic: 12, extra: 0 }
  ]
};
</script>

<template>
  <div class="basic-data-container">
    <div>
      <div class="c-data-box">
        <div
          v-for="(data, index) of datas"
          class="c-data"
          :class="index % 2 === 1 ? '' : 'c-data-black'"
          :key="data.text"
        >
          <Icon
            type="projection"
            :src="icons[index]"
            :size="20"
            color="rgba(255,255,255,0.7)"
          />
          <span>{{ data.text }}</span>
          <span>+{{ data.value }}</span>
        </div>
      </div>
      <button
        class="c-detail"
        @click="
          () => {
            Sound.DDing.replay();
            detailVisible = true;
          }
        "
      >
        圣遗物详情
      </button>
      <DetailData
        :visible="detailVisible"
        :prefix="true"
        @close="() => (detailVisible = false)"
        :basic-data="data.basic"
        :more-data="data.more"
        :element-data="data.element"
      />
      <div class="c-intro">
        <ArtifactDescribe
          :id="1638"
          :active="3"
          hideDisable
        />
      </div>
    </div>

    <Button
      type="shrink"
      class="button-line"
      sound="dong"
    >
      替换
    </Button>
  </div>
</template>

<style scoped lang="less">
@import '@@@/index.less';
.basic-data-container {
  height: 100%;
  padding: 40px 0;
  box-sizing: border-box;
  margin: 0 120px 0 50px;

  color: @blank-white;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.c-name {
  font-size: 30px;
}

.c-data {
  &-box {
    margin: 10px;
    margin-left: 0px;
    & > :nth-child(2n + 1) {
      background: radial-gradient(circle at center, rgba(0, 0, 0, 0.1), transparent);
    }
  }

  & :nth-child(2) {
    flex-grow: 1;
    padding-left: 5px;
  }

  font-size: 20px;

  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px;
}

.c-detail {
  width: 100%;
  padding: 2px;
  margin: 7px 0;

  background-clip: content-box;
  background-color: rgba(255, 255, 255, 0.2);

  outline: none;
  font-size: 24px;
  height: 40px;
  border-radius: 40px;
  color: @blank-white;
  opacity: 0.8;

  border: 2px solid rgba(255, 255, 255, 0.2);

  text-align: center;

  &:active {
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
    background: rgba(255, 255, 255, 0.3);
  }
}

.c-intro {
  margin: 20px 0;
  color: rgba(255, 255, 255, 0.5);
  font-size: 22px;
  line-height: 25px;
}
</style>
