<script setup lang="ts">
import { RichNodeRender, RichNodeAction, RichNode } from '@/components/RichNode';
import { ClassNameFactor, EventDispatch } from '@/utils';
import { useCharacterLayoutStore } from '@/stores/CharacterLayout';
import { ref, watch } from 'vue';

const updater = ref(1);
const rich = new RichNodeAction(() => updater.value++);

const store = useCharacterLayoutStore();

const S = ClassNameFactor('highlight-');

const codeStyle = [
  S('spe'),
  S('fire'),
  S('water'),
  S('elec'),
  S('ice'),
  S('grass'),
  S('wind'),
  S('stone'),
  S('italic'),
  ''
];

const stylesText = ['特殊', '火', '水', '雷', '冰', '草', '风', '岩', '斜体', '清除'];

const changeStyle = (e: Event) => {
  EventDispatch(e, {
    btn: (dataset) => {
      rich.addStyle({ uni: codeStyle[parseInt(dataset.style)] });
    }
  });
};

const generateStainCode = (node: RichNode): string => {
  if (node.children.length) {
    return node.children.map((n) => generateStainCode(n)).join('');
  } else {
    // 根据style格式化
    if (node.style.uni) {
      const index = codeStyle.indexOf(node.style.uni);
      return `$${index}${node.text}$`;
    } else {
      return node.text;
    }
  }
};

watch(
  [() => store.cRight, () => store.lives, () => store.talent, () => store.characterStatic],
  () => {
    let initText = '';
    if (store.cRight === 'lives' && store.lives !== -1) {
      initText = store.characterStatic?.life[store.lives].desc || '';
    } else if (store.cRight === 'talents' && store.talent !== -1) {
      initText = store.characterStatic?.talents[store.talent].intro || '';
    }

    const codes = initText
      .trim()
      .split('$')
      .filter((i) => i)
      .map((str) => ({
        style: codeStyle[parseInt(str[0])],
        text: codeStyle[parseInt(str[0])] ? str.slice(1) : str
      }));

    rich.initWithStage((dict) => {
      const children = codes.map((c) => dict.new(c.text, c.style ? { uni: c.style } : undefined));

      if (children.length === 1) return children[0];

      const root = dict.new();

      root.children = children;
      return root;
    });
    updater.value++;
  },
  {
    immediate: true
  }
);
</script>

<template>
  <div
    class="stainer"
    @click.stop="() => {}"
  >
    <div
      class="stainer-operator"
      data-type="bar"
      @click="changeStyle"
    >
      <span
        v-for="(k, i) of stylesText"
        :class="codeStyle[i]"
        :key="k"
        data-type="btn"
        :data-style="i"
      >
        {{ k }}
      </span>
      <span @click="() => {
        store.updateCurrentStainText(generateStainCode(rich.node))
      }">提交</span>
    </div>
    <div class="stainer-scroll">
      <RichNodeRender
        :update="updater"
        :rich="rich.node"
      />
    </div>
  </div>
</template>

<style lang="less">
@import '@@/HighLight/index.less';

.stainer {
  width: 80%;
  margin: 20px;
  background: linear-gradient(180deg, @fontdarkgray, rgba(72, 85, 103, 0.7));
  color: @blank-white;
  font-size: 26px;
  overflow: hidden;

  &-operator {
    display: flex;
    margin: 20px;
    justify-content: space-evenly;
    color: @blank-white;
    & > span {
      cursor: pointer;
      &:active {
        opacity: 0.8;
      }
    }
  }

  &-scroll {
    height: 700px;
    margin: 20px;
    white-space: pre-line;

    user-select: text;
  }
}
</style>
