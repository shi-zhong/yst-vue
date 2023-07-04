<script lang="ts">
import { defineComponent, ref } from 'vue';
import { DecorationMap } from './Decoration'
import { ClassNameFactor } from '@/utils/className';

export default defineComponent({
  name: 'Icon',
  props: {
    icon: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      reqired: false
    }
  },
  components: DecorationMap,
  setup(props) {

    const isDecoration = ref(false)

    const S = ClassNameFactor('button-wrap-')

    if (Object.keys(DecorationMap).includes(props.icon)) {
      isDecoration.value = true;
    }

    return {
      isDecoration,
      S: (argu: any) => S(argu)
    }
  }
})
</script>

<template>
  <component v-if="isDecoration" :is="icon" :class="S('special')" />
  <img v-else :class="S('image')" :style="{ width: 50 }" :draggable="false" :src="icon" :alt="icon || 'button'" />
</template>

<style scoped lang="less">
@import './Decoration.less';
</style>