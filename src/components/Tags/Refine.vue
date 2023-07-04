<script setup lang="ts">
interface RefineProps {
  refine: number;
  refineEnd?: boolean;
  text?: boolean;
}
const props = defineProps<RefineProps>();
</script>

<template>
  <div v-if="props?.text">
    <div
      :class="['refine-with-text-container', props.refineEnd ? 'refine-end' : 'refine']"
    >
      {{ props.refine }}
    </div>
    <span class="refine-with-text-text">精炼{{ props.refine }}阶</span>
  </div>

  <div
    v-else
    :class="['refine-container', props.refineEnd ? 'refine-end' : 'refine']"
  >
    {{ props.refine }}
  </div>
</template>

<style scope lang="less">

.refine {
  &-container {
    width: 15px;
    height: 17px;
    margin: 5px;
    border-radius: 3px;
    text-align: center;
    line-height: 125%;
  }
  &-end {
    background: @rank-golden-bar;
    color: @starcolor;
  }
  background: @fontdarkgray;
  color: @blank-white;
}

.refine-with-text {
  &-container {
    width: 30px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    border-radius: 3px;
    display: inline-block;
    margin-right: 10px;
  }

  &-text {
    color: rgb(203, 178, 124);
  }
  background: @fontdarkgray;
  color: @blank-white;
}
</style>
