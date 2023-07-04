import { defineComponent, type Component } from 'vue';
import { ClassNameFactor } from '@/utils/className';

const S = ClassNameFactor('decoration-');

const DecorationMap: {
  [key: string]: Component;
} = {};

// 注册函数 + 工厂函数
const Decoration = (style: string) => {
  const component = defineComponent({
    name: style,
    render() {
      return <div class={S(style)}></div>;
    }
  });

  if (DecorationMap[style] === undefined) {
    DecorationMap[style] = component;
  }

  return component;
};

const ForkDecoration = Decoration('fork');
const RoundDecoration = Decoration('round');

export { DecorationMap, ForkDecoration, RoundDecoration };
export default {
  ForkDecoration,
  RoundDecoration
};
