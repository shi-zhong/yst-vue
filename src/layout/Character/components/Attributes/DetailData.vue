<script setup lang="tsx">
import { ref } from 'vue';

import { EventDispatch, ElementMastery } from '@/utils';
import DropMask from './DropMask.vue';

import LifeMax from '@/assets/icons/lifeMax.png';
import Attack from '@/assets/icons/attack.png';
import Defence from '@/assets/icons/defence.png';
import EMaster from '@/assets/icons/elementMaster.png';
import Power from '@/assets/icons/power.png';

import { ScrollView, Icon, Element } from '@shi-zhong/genshin-ui';
import Sound from '@/assets/sound';

const { Anemo, Cryo, Dendro, Electro, Geo, Hydro, Pyro } = Element.ElementPng;

const basicAttri = [
  { icon: LifeMax, txt: '生命值上限' },
  { icon: Attack, txt: '攻击力' },
  { icon: Defence, txt: '防御力' },
  { icon: EMaster, txt: '元素精通' },
  { icon: Power, txt: '体力上限' }
];
const moreAttri = [
  { icon: '', txt: '暴击率' },
  { icon: '', txt: '暴击伤害' },
  { icon: '', txt: '治疗加成' },
  { icon: '', txt: '受治疗加成' },
  { icon: '', txt: '元素充能效率' },
  { icon: '', txt: '冷却缩减' },
  { icon: '', txt: '护盾强效' }
];
const element = [
  { icon: Pyro, txt: '火' },
  { icon: Hydro, txt: '水' },
  { icon: Dendro, txt: '草' },
  { icon: Electro, txt: '雷' },
  { icon: Anemo, txt: '风' },
  { icon: Cryo, txt: '冰' },
  { icon: Geo, txt: '岩' },
  { icon: '', txt: '物理' }
];
const query = ['元素精通', '元素充能效率', '冷却缩减', '护盾强效'];

const props = defineProps<{
  visible: boolean;
  prefix?: boolean;
  basicData: { basic: number; extra: number }[];
  moreData: number[];
  elementData: { basic: number; extra: number }[];
}>();

const emits = defineEmits<{ (e: 'close'): void }>();

const basicFormat = (p: { basic: number; extra: number }) => {
  return {
    basic: Number(p.basic).toLocaleString(),
    extra: p.extra !== 0 ? `+${Number(p.extra).toLocaleString()}` : ''
  };
};

const moreFormat = (n: number) => `${Number(n).toFixed(1)}%`;

const Line = (prop: {
  icon: string;
  txt: string;
  data: {
    basic?: string;
    extra?: string;
  };
  tag?: boolean;
}) => {
  const { icon, txt, data } = prop;
  return (
    <div
      class={'d-line ' + (query.includes(txt) ? 'd-query' : '')}
      data-type="dataline"
      data-txt={txt}
      onClick={() => Sound.DDing.once()}
    >
      <Icon
        src={icon}
        type="projection"
        style={{ height: '30px', width: '30px', margin: '5px 20px' }}
        size={25}
        color="white"
      />
      <div>{txt}</div>
      <div>
        {props.prefix && txt !== '体力上限' ? '+' : ''}
        {data.basic || ''}
      </div>
      <div>&nbsp;{data.extra || ''}</div>
    </div>
  );
};

const infoMask = ref('');
const handleClose = () => {
  infoMask.value = '';
};

const openMask = (e: Event) => {
  EventDispatch(e, {
    dataline: (dataset) => {
      if (query.includes(dataset.txt)) {
        infoMask.value = dataset.txt;
      }
    }
  });
};

const eMaster = ElementMastery(props.basicData[3].basic);
</script>

<template>
  <DropMask
    :visible="props.visible"
    @close="emits('close')"
  >
    <ScrollView
      class="d-scroll"
      @click="(e) => openMask(e)"
      data-type="topelement"
    >
      <span class="d-title">基础属性</span>
      <template
        v-for="(b, index) of basicAttri"
        :key="b.txt"
      >
        <Line
          :icon="b.icon"
          :txt="b.txt"
          :data="basicFormat(props.basicData[index])"
        />
      </template>
      <span class="d-title">进阶属性</span>
      <template
        v-for="(b, index) of moreAttri"
        :key="b.txt"
      >
        <Line
          :icon="b.icon"
          :txt="b.txt"
          :data="{ basic: moreFormat(props.moreData[index]), extra: '' }"
        />
      </template>
      <span class="d-title">元素属性</span>
      <template
        v-for="(b, index) of element"
        :key="b.txt"
      >
        <Line
          :icon="b.icon"
          :txt="b.txt + '元素伤害加成'"
          :data="{ basic: moreFormat(props.elementData[index].basic), extra: '' }"
        />
        <Line
          icon=""
          :txt="b.txt + '元素抗性'"
          :data="{ basic: moreFormat(props.elementData[index].extra), extra: '' }"
        />
      </template>
    </ScrollView>
  </DropMask>
  <DropMask
    :visible="infoMask !== ''"
    @close="handleClose"
    :autoClose="true"
  >
    <div
      class="dq-container"
      v-if="infoMask === '护盾强效'"
    >
      <div class="dq-title">护盾强效</div>
      <ScrollView class="dq-content">
        护盾强效能增强护盾抵御伤害的能力。<br />
        这个数值越高，护盾的伤害吸收量就越高。
      </ScrollView>
    </div>
    <div
      class="dq-container"
      v-if="infoMask === '冷却缩减'"
    >
      <div class="dq-title">冷却缩减</div>
      <ScrollView class="dq-content">
        冷却缩减能减少元素战技、元素爆发的冷却时间。<br />
        这个数值越高，冷却时间就越短。
      </ScrollView>
    </div>
    <div
      class="dq-container"
      v-if="infoMask === '元素充能效率'"
    >
      <div class="dq-title">元素充能效率</div>
      <ScrollView class="dq-content">
        元素充能效率能提高通过元素微粒、元素晶球补充的元素能量。<br />
        这个数值越高，能补充的元素能量就越多。
      </ScrollView>
    </div>
    <div
      class="dq-container"
      v-if="infoMask === '元素精通'"
    >
      <div class="dq-title">元素精通</div>
      <ScrollView class="dq-content">
        元素精通可以提升元素反应带来的收益。<br />
        · 蒸发、融化反应造成伤害时，伤害提升{{
          Number(eMaster.amplification * 100).toFixed(1)
        }}%；<br />
        · 超载、超导、感电、燃烧、碎冰、扩散、绽放、超绽放、烈绽放反应造成的伤害提<br />
        升{{ Number(eMaster.fusion * 100).toFixed(1) }}%；<br />
        · 超激化、蔓激化反应带来的伤害提升提高{{
          Number(eMaster.intensify * 100).toFixed(1)
        }}%；<br />
        · 结晶反应形成的晶片护盾，提供的伤害吸收量提升{{
          Number(eMaster.crystal * 100).toFixed(1)
        }}%。
      </ScrollView>
    </div>
  </DropMask>
</template>

<style scoped lang="less">
@import '@@@/index.less';
.d-scroll {
  width: 80%;
  height: 100%;
  margin: 0 auto;
}

.d-title {
  height: 50px;
  font-size: 20px;
  line-height: 50px;
  color: rgba(255, 255, 255, 0.5);
}

.d-line {
  display: flex;
  align-items: center;
  font-size: 25px;
  color: @blank-white;
  height: 60px;
  border: 1px solid transparent;

  &:hover {
    border-color: white;
  }

  &:nth-of-type(2n + 0) {
    background-color: rgba(0, 0, 0, 0.2);
  }
  &:nth-of-type(2n + 1) {
    background-color: rgba(255, 255, 255, 0.01);
  }

  & :nth-child(2) {
    width: 70%;
  }
  & :nth-child(3) {
    width: 15%;
    text-align: right;
  }
  & :nth-child(4) {
    width: 20%;
    color: rgb(121, 178, 34);
  }
}

.d-query::after {
  content: '?';
  width: 35px;
  aspect-ratio: 1;
  line-height: 35px;
  margin-right: 30px;
  border-radius: 50%;

  color: #465567;
  text-align: center;

  background-color: @blank-white;
  position: absolute;
  right: 0;
}

.dq-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.dq-title {
  color: @blank-white;
  font-size: 40px;
}
.dq-content {
  color: @blank-white;
  font-size: 30px;
  line-height: 50px;
  margin-top: 20px;
  padding: 20px 0;
  display: inline-block;
  white-space: nowrap;

  border: 1px solid white;
  border-left-color: transparent;
  border-right-color: transparent;
  opacity: 0.8;
}
</style>
