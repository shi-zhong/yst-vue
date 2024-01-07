<script setup lang="ts">
import type { BuildTimeLine } from '../interface';
import TimeLineGroup from '@/components/TimeLine/view/TimeLineGroup.vue';
import { ScrollView } from '@shi-zhong/genshin-ui';
import { Between } from '@/utils';
import { computed, ref } from 'vue';

const props = withDefaults(
  defineProps<{
    title?: string;
    box: {
      width: number;
      height: number;
    };
    zoom: {
      min?: number;
      max?: number;
    };
    defaultZoom: number;
    minUint: number;
    timeLine: BuildTimeLine;
  }>(),
  {
    box: () => ({
      width: 500,
      height: 25
    }),
    zoom: () => ({
      min: 1
    }),
    defaultZoom: 1
  }
);

const zoom = ref(props.defaultZoom || 1);

const radius = computed(() => props.box.height / 2 / zoom.value);

const handleWheel = (e: WheelEvent) => {
  const { altKey, deltaY } = e;
  if (altKey) {
    // zoom
    zoom.value = Between(zoom.value + 0.2 * (deltaY > 0 ? 1 : -1), props.zoom.min, props.zoom.max);
  }
};

const groupNames = computed(() => {
  const names: string[] = [];

  props.timeLine.groups.map((group) => {
    names.push(group.name);
    for (let i = group.thumbs.length - 1; i > 0; i--) {
      names.push('');
    }
  });

  return names;
});
</script>

<template>
  <div>
    <div class="title">{{ title }}</div>
    <div class="timeline-content">
      <div>
        <div class="group-name"></div>
        <div
          v-for="name in groupNames"
          class="group-name"
          :key="name"
        >
          {{ name }}
        </div>
      </div>
      <ScrollView
        direction="x"
        :style="{ width: `${box.width}px` }"
        scroll-behavior="hidden"
        :border="{ left: 0, right: 0 }"
        @wheel="handleWheel"
      >
        <div
          class="group-name"
          style="background-color: red"
        ></div>
        <TimeLineGroup
          v-for="(timelinegroup, index) in timeLine.groups"
          :box="box"
          :key="timelinegroup.name"
          :thumbs="timelinegroup.thumbs"
          :radius="radius"
          :minUnit="minUint"
          :payload="timelinegroup.payload"
          :trackColor="
            timelinegroup.trackColor ||
            (typeof timeLine.trackColor === 'string'
              ? timeLine.trackColor
              : timeLine.trackColor.bind({}, index))
          "
          :thumbColor="
            timelinegroup.thumbColor ||
            (typeof timeLine.thumbColor === 'string'
              ? timeLine.thumbColor
              : timeLine.thumbColor.bind({}, index))
          "
        />
      </ScrollView>
    </div>
  </div>
</template>

<style lang="less" scoped>
.timeline-content {
  display: flex;
}
.group-name {
  height: 25px;
  margin: 5px;
}
</style>
