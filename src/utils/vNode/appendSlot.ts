import { defineComponent } from 'vue';

export const AppendSlot = defineComponent({
  props: ['default'],
  setup(props) {
    // 自动继承attrs，本组件只是为了褪去一层slot.default外壳
    return () => props.default()[0];
  }
});
