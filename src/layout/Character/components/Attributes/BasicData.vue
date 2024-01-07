<script setup lang="ts">
import { Button, RankBar, Icon } from '@shi-zhong/genshin-ui';
import { useCharacterStateStore } from '@/stores/Character';
import { LongPress } from '@/utils/directive/longPress';
import { watch, ref } from 'vue';
import LifeMax from '@/assets/icons/lifeMax.png';
import Attack from '@/assets/icons/attack.png';
import Defence from '@/assets/icons/defence.png';
import EMaster from '@/assets/icons/elementMaster.png';
import Power from '@/assets/icons/power.png';

import DetailData from './DetailData.vue';
import { Sound } from '@/utils/sound';

const buttonSelect = ref(false);

const lvl = ref(1);
const rank = ref<0 | 1 | 2 | 3 | 4 | 5 | 6>(0);
const detailVisible = ref(false);
const store = useCharacterStateStore();

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
  },
  {
    text: '体力上限',
    value: '240'
  }
];

const icons = [LifeMax, Attack, Defence, EMaster, Power];

const lvlAdd = () => {
  if (lvl.value < decideMax(rank.value)) {
    lvl.value++;
  } else if (rank.value !== 6) {
    rank.value++;
  }
};
const lvlDec = () => {
  if (lvl.value > decideMin(rank.value)) {
    lvl.value--;
  } else if (rank.value !== 0) {
    rank.value--;
  }
};
const decideMax = (rank: 0 | 1 | 2 | 3 | 4 | 5 | 6) => {
  return [20, 40, 50, 60, 70, 80, 90][rank];
};
const decideMin = (rank: 0 | 1 | 2 | 3 | 4 | 5 | 6) => {
  return [1, 20, 40, 50, 60, 70, 80][rank];
};
const decideMaxTxt = () => {
  if (store.sidebar.state !== 'folding') return '培养';
  if (lvl.value === 90) {
    return '满级';
  } else if (decideMax(rank.value) === lvl.value) {
    return '突破';
  } else {
    return '升级';
  }
};
const decideMinTxt = () => {
  if (lvl.value === 1) {
    return '初始';
  } else if (decideMin(rank.value) === lvl.value) {
    return '回流';
  } else {
    return '降级';
  }
};

const { vLong, clickCancel } = LongPress();

const data = {
  basic: [
    {
      basic: 9450,
      extra: 6511
    },
    {
      basic: 979,
      extra: 1077
    },
    {
      basic: 564,
      extra: 114
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
      <div class="c-name">纳西妲</div>
      <RankBar
        class="c-rankbar"
        :size="35"
        :rank="rank"
      />
      <div class="c-lvl">
        等级 {{ lvl }} <span class="c-lvl-max">/ {{ decideMax(rank) }}</span>
      </div>
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
          <span>{{ data.value }}</span>
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
        详细信息
      </button>
      <DetailData
        :visible="detailVisible"
        @close="() => (detailVisible = false)"
        :basic-data="data.basic"
        :more-data="data.more"
        :element-data="data.element"
      />
      <div class="c-intro">深居净善宫的笼中之鸟，只能在梦中将世界尽收眼底。</div>
    </div>
    <div class="button">
      <!-- //sound="dong" -->
      <Button
        type="shrink"
        :disable="lvl === 1"
        :class="!buttonSelect ? 'button-round' : 'button-line'"
        @click="
          clickCancel(() => {
            if (store.sidebar.state !== 'folding') return;
            if (buttonSelect) {
              lvlDec();
            } else {
              buttonSelect = true;
            }
          })
        "
        v-long:1000="(window: Window) => {
          let timeout = 0;
          Sound.Dong.replay()
          const next = () => {
              lvlDec();
              timeout = window.setTimeout(() => {
                next();
              }, 50);
          }
          next();
          return () => {
            window.clearTimeout(timeout)
          }
        }"
      >
        {{ !buttonSelect ? 'D' : decideMinTxt() }}
      </Button>
      <!-- sound="dong" -->
      <Button
        type="shrink"
        :disable="lvl === 90"
        :class="buttonSelect ? 'button-round' : 'button-line'"
        @click="
          clickCancel(() => {
            if (store.sidebar.state !== 'folding') {
              store.sidebar.next('back');
              return;
            }
            if (!buttonSelect) {
              lvlAdd();
            } else {
              buttonSelect = false;
            }
          })
        "
        v-long:1000="(window: Window) => {
          let timeout = 0;
          Sound.Dong.replay()
          const next = () => {
              lvlAdd();
              timeout = window.setTimeout(() => {
                next();
              }, 50);
          }
          next();
          return () => {
            window.clearTimeout(timeout)
          }
        }"
      >
        {{ buttonSelect ? 'U' : decideMaxTxt() }}
      </Button>
    </div>
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

.c-rankbar {
  margin: 5px 0;
}

.c-lvl {
  font-size: 26px;
  &-max {
    color: rgba(255, 255, 255, 0.5);
  }
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
  font-size: 20px;
  line-height: 25px;
}

.button {
  display: flex;
  justify-content: space-between;

  &-round {
    transition: 0.2s all;
    width: 50px;
  }

  &-line {
    transition: 0.2s all;
    width: 80%;
  }
}
</style>
